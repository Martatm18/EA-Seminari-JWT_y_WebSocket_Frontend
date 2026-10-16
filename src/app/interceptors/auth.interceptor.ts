import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';

import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';

// Mensaje con el que la API suele responder 401 cuando el access token ha caducado
const TOKEN_EXPIRED = 'El token ha caducado';

// Las peticiones son inmutables: para añadir una cabecera se hace una copia con clone()
function withToken(request: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return request.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
}

// Interceptor global para gestionar el token en memoria y su renovación automática
export const authInterceptor: HttpInterceptorFn = (request, next) => {
  // Las rutas de /auth (login, refresh, logout) no llevan cabecera de token y usan cookies
  if (request.url.startsWith(`${environment.apiUrl}/auth/`)) {
    return next(request);
  }

  const auth = inject(AuthService);
  const token = auth.getToken();

  // Si tenemos token en memoria, lo adjuntamos a la petición
  return next(token ? withToken(request, token) : request).pipe(
    catchError((error: HttpErrorResponse) => {
      // Cualquier error que no sea 401 (Unauthorized) lo dejamos pasar tal cual
      if (error.status !== 401) {
        return throwError(() => error);
      }

      // Si el 401 ocurre porque el access token ha caducado, intentamos renovarlo con la cookie
      if (error.error?.message === TOKEN_EXPIRED || error.status === 401) {
        return auth.refresh().pipe(
          // Si el refresh falla (la cookie también expiró), cerramos la sesión completamente
          catchError((refreshError) => {
            auth.logout();
            return throwError(() => refreshError);
          }),
          // Cuando llega el nuevo access token, reintentamos la petición original con él
          switchMap((newToken) => next(withToken(request, newToken))),
        );
      }

      // Para cualquier otro caso de 401, cerramos sesión
      auth.logout();
      return throwError(() => error);
    }),
  );
};
