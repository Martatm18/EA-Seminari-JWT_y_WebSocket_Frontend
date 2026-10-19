# Enllaç Vídeo Explicació Exercici Seminari JWT y WebSocket: https://drive.google.com/file/d/1QR9e3XDireheqxeiN17eZUStgacC3Vg4/view?usp=sharing
# Enllaç Vídeo Explicació Exercici Part WebSocket Seminari JWT y WebSocket: https://drive.google.com/file/d/17LmOIJjV_t_dvsg25Ybz0vfpakzG6X7-/view?usp=sharing
# Documentació:
**1. Referències dels materials consultats**
- Repositoris del seminari.
- Els vídeos proposats.
- Explicació de classe.
  
**2. Detall de l'ús de la IA generativa**
Eina i model d'IA usat: Gemini (Google) / ChatGPT (OpenAI).
**Registre d'usos:**
- **Registre 1:** Sincronització de l'Interceptor HTTP amb el Refresh Asíncron **(Frontend)**:
  - **Prompt literal:** Com puc configurar el HttpInterceptor d'Angular perquè, si una petició falla amb 401, capturi l'error, llanci un refresh silenciós usant credencials de cookie, actualitzi la Signal del token i reintenti la petició original sense entrar en un bucle infinit?
  - **Incoherències detectades en la resposta:** La IA em va donar un codi una mica antic basat en operadors de RxJS que ja no s'acaben de portar bé a Angular 18, i a més no contemplava què passava si la petició de refresh que fallava era ella mateixa, la qual cosa em bloquejava l'app i em creava un bucle de peticions infinites.
  - **Solució / adaptació manual:** He hagut de netejar el codi i adaptar-lo manualment usant l'operador switchMap modern, a més d'afegir un condicional simple al catchError perquè comprovi si l'error ve de la ruta de /refresh, si és així, directament faig logout per evitar el bucle.
- **Registre 2:** Gestió de Cookies Creuades i CORS en Desenvolupament Local **(Backend i Frontend)**:
  - **Prompt literal:** Tinc el frontend a localhost:4200 i el backend a localhost:3000. En fer login, el navegador rebutja  guardar o enviar la cookie HttpOnly. Com he de configurar CORS a Express i la petició HTTP a Angular?
  - **Incoherències detectades en la resposta:** La IA em va dir que posés un asterisc (origin: '*') al CORS d'Express per anar més ràpid. El problema és que els navegadors moderns bloquegen automàticament l'enviament de cookies si l'origen té un asterisc en comptes d'una URL concreta.
  - **Solució / adaptació manual:** He hagut de corregir-ho a mà posant l'origen exacte del client (http://localhost:4200) i assegurar-me de marcar credentials, true al servidor i afegir { withCredentials: true } a les peticions HTTP d'Angular perquè el navegador acceptés enviar la cookie.
- **Registre 3:** Coincidència de Metadades en la Destrucció de Cookies al logout **(Backend)**
  - **Prompt literal:** En fer logout a Express crido a res.clearCookie('refreshToken'), però la cookie continua apareixent al navegador. Per què no s'esborra?
  - **Incoherències detectades en la resposta:** La IA em va dir simplement que fes res.clearCookie('refreshToken') i ja està, sense tenir en compte que com que havíem creat la cookie amb un path restringit i paràmetres concrets, el navegador s'unia a la regla i ignorava l'esborrat si no li passaves exactament les mateixes dades.
  - **Solució / adaptació manual:** He hagut de crear una funció petita al controlador anomenada getCookieOptions() per reutilitzar exactament la mateixa configuració tant al login com al logout, aconseguint així que el navegador l'esborrés de veritat.
- **Registre 4:** Disposició i Indicadors Visuals del Sistema d'Estats de Presència **(Frontend)**:
 - **Prompt literal:** Com puc afegir un selector d'estats (Disponible, No molestar, Invisible) a la vista del xat d'Angular i mostrar un punt de color dinàmic (verd, groc, gris) al costat de cada usuari segons la seva connexió?
 - **Incoherències detectades en la resposta:** La IA va proposar estructures HTML antigues utilitzant directrius *ngIf i *ngFor en lloc del nou flux de control natiu d'Angular 18 (@if, @for). A més, a nivell de CSS utilitzava selectors de colors primaris molt cridaners (com el groc pur o el vermell) que trencaven l'estètica visual de l'aplicació i sobrecarregaven la llista d'usuaris.
 - **Solució / adaptació manual:** Vaig refactoritzar la plantilla HTML per utilitzar la sintaxi moderna @if (me(); as me) i @for (person of people(); track person._id). A chat.css, vaig dissenyar l'estructura .presence-selector amb botons arrodonits (border-radius: 999px), vaig implementar la classe .connection-indicator i vaig definir una paleta de colors suavitzada (verd #218a49 per a disponible, groc daurat #f5b700 per a "No molestar" i gris #8a9099 per a desconnectat/invisible).
- **Registre 5:** Adaptació de la Llista d'Usuaris com a "Pastilles" Interactives i Accessibilitat **(Frontend)**:
 - **Prompt literal:** Com faig perquè la llista d'usuaris es vegi com a botons tipus "pastilla" flexibles i que al fer clic s'obri el xat directe amb aquell usuari de manera accessible?
 - **Incoherències detectades en la resposta:** La IA va generar un CSS basat en taules (<table>) o llistes verticals rígides que no s'adaptaven bé quan hi havia molts usuaris. A més, no va incloure cap consideració d'accessibilitat per a lectors de pantalla, deixant els botons sense text descriptiu ni indicació clara d'estat per a usuaris amb visió reduïda.
 - **Solució / adaptació manual:** A chat.css vaig implementar un contenidor flex-wrap amb .people-list i vaig dissenyar el component .person com una pastilla interactiva amb efectes d'hoover (:hover). A chat.html, vaig adaptar el contingut afegint un element amb la classe .visually-hidden per llegir el text de l'estat en lectors de pantalla (com (en el chat, en modo no molestar)), a més d'afegir atributs title dinàmics a cada botó d'usuari.
- **Registre 6:** Responsive Design del Xat i l'Estructura de la Conversa **(Frontend)**:
 - **Prompt literal:** Com puc fer que la finestra del xat i el formulari d'enviament de missatges es mantinguin fixes i adaptables en pantalles petites de mòbil?
 - **Incoherències detectades en la resposta:** La IA recomanava utilitzar amplades fixes en píxels (width: 600px) i posicions absolutes (position: absolute), la qual cosa feia que en pantalles de mòbil la caixa de text s'amagués sota del teclat o que la llista de missatges sobrepassés el límit de la pantalla.
 - **Solució / adaptació manual:** Vaig reestructurar la secció .conversation utilitzant CSS Grid de tres files (grid-template-rows: auto minmax(240px, 1fr) auto). A la llista de missatges (.message-list) vaig establir un desplegament per scroll amb overflow-y: auto i un màxim d'alçada dinàmic (max-height: 55vh). Finalment, vaig afegir una @media (max-width: 540px) específica per ajustar la direcció dels controls (flex-direction: column) i adaptar l'amplada dels missatges al 94% de la pantalla en dispositius mòbils.
  
# Seminari 7: frontend Angular con JWT y WebSockets

Backoffice en Angular para gestionar **autores** y **libros**: desde aquí se pueden listar, buscar,
crear, editar y borrar. Para entrar hay que iniciar sesión, y el backoffice es solo para
administradores. Es el frontend del Seminario 7 de EA:

> Backend/Frontend: JWT, WebSockets. Backend TS + Express. Frontend Angular.

Este repositorio parte del frontend del Seminario 6, que ya cubría consumir una API REST (CRUD),
formularios reactivos, validación y routing. Sobre esa base, el equipo añade en este seminario:

- Registro y login, con el token JWT guardado, un interceptor que lo envía y guards en las rutas
- Listados paginados por el servidor
- Extra: chat en tiempo real con socket.io (general, de grupo y directo)

Consume la API de [EA-Seminari7-JWT-WebSockets-Backend](https://github.com/Dsoledispa/EA-Seminari7-JWT-WebSockets-Backend).

Cómo funciona por dentro (componentes, servicios, signals, routing, formularios...): [GUIA.md](GUIA.md).
Las tareas y la bitácora del seminario: [LOGS.md](LOGS.md). Cómo trabajamos (ramas, commits, pull
requests): [CONTRIBUTING.md](CONTRIBUTING.md).

## Stack tecnológico

Lo que ya está instalado y funcionando:

| Tecnología | Versión | Para qué se usa |
|---|---|---|
| [Angular](https://angular.dev/) | 21.2 | Framework del frontend: componentes, router, formularios y cliente HTTP, todo oficial |
| [TypeScript](https://www.typescriptlang.org/) | 5.9 | JavaScript con tipos. Angular fija qué versiones admite, por eso no va en la 6.0 como el backend |
| [RxJS](https://rxjs.dev/) | 7.8 | Observables: lo que devuelve `HttpClient` y a lo que se hace `subscribe` |
| [Angular CLI](https://angular.dev/tools/cli) | 21.2 | El comando `ng`: servidor de desarrollo, build, tests, lint y generar componentes |
| [Vitest](https://vitest.dev/) | 4.1 | Ejecuta los tests (`*.spec.ts`). Es el runner por defecto de Angular desde que Karma quedó obsoleto |
| [jsdom](https://github.com/jsdom/jsdom) | 28.1 | Simula el navegador dentro de Node para que los tests puedan pintar componentes |
| [ESLint](https://eslint.org/) + [angular-eslint](https://github.com/angular-eslint/angular-eslint) | 10.12 / 21.4 | Linter: analiza el TypeScript y también las plantillas HTML, con reglas propias de Angular y de accesibilidad |
| [Prettier](https://prettier.io/) | 3.9 | Da formato al código (reglas en `.prettierrc`, con el parser de Angular para los `.html`) |
| [socket.io-client](https://socket.io/docs/v4/client-api/) | 4.8 | Cliente de WebSockets del chat, encapsulado en `ChatService` |

El token JWT no necesita librería: el interceptor y el guard se hacen con lo que ya trae Angular.

## Requisitos previos

- [Node.js](https://nodejs.org/) 24 LTS (mínimo 22.12, que es lo que exige Angular 21). Incluye
  [npm](https://www.npmjs.com/).
- El backend del Seminario 7 arrancado, con su MongoDB (ver abajo).
- [VS Code](https://code.visualstudio.com/) con la extensión *Angular Language Service* (recomendado) y
  [Angular DevTools](https://angular.dev/tools/devtools) en el navegador.

Angular CLI no hace falta instalarlo aparte: viene con las dependencias del proyecto (`npx ng ...`).

## Cómo arrancarlo

Hacen falta dos terminales: una para la API y otra para Angular.

**1. Backend**

Con MongoDB ya arrancado (o con la URL de Atlas puesta en el `.env`):

```
git clone https://github.com/Dsoledispa/EA-Seminari7-JWT-WebSockets-Backend
cd EA-Seminari7-JWT-WebSockets-Backend
npm install
cp .env.example .env
npm run seed
npm run dev
```

La API queda en http://localhost:1337 y su documentación (Swagger) en http://localhost:1337/api-docs.
`npm run seed` mete 2 usuarios, 12 autores y 12 libros de ejemplo; con `npm run seed -- --reset` se
vuelven a poner desde cero. Si tu base de datos es de antes del Seminario 7, ejecuta una de las dos
cosas: `npm run migrate-authors` o `npm run seed -- --reset` (lo explica el README del backend).
Si ya tenías un `.env`, copia en él las variables `JWT_...` de `.env.example`.

**2. Frontend (este repo)**

```
git clone https://github.com/Dsoledispa/EA-Seminari7-JWT-WebSockets-Frontend
cd EA-Seminari7-JWT-WebSockets-Frontend
npm install
npm start
```

Y se abre http://localhost:4200. La página se recarga sola cada vez que guardas un archivo.

**3. Iniciar sesión** con uno de los usuarios del seed (las contraseñas son públicas a propósito):

| Email | Contraseña | Qué ve |
|---|---|---|
| `admin@example.com` | `seminari7` | El backoffice entero: autores y libros |
| `user@example.com` | `seminari7` | Solo la página de inicio: el backoffice es para administradores |

También se puede crear una cuenta en "Registrarse". Las cuentas nuevas son siempre de rol `user`.

## Configuración: un solo fichero

El frontend no usa `.env`: lo que llega al navegador lo puede leer cualquiera, así que aquí no hay
secretos. Toda la configuración está en **un** fichero, y para cambiar la dirección de la API o del chat se toca
aquí y en ningún sitio más:

```typescript
// src/environments/environment.ts
export const environment = {
  // URL usada por las llamadas HTTP.
  apiUrl: 'http://localhost:1337',

  // URL base usada para conectar con Socket.IO.
  socketUrl: 'http://localhost:1337',
};
```

Las dos son iguales porque el backend sirve la API y el chat en el mismo puerto.

## Scripts

| Comando | Qué hace |
|---|---|
| `npm start` | Servidor de desarrollo en http://localhost:4200. Se recarga solo al guardar |
| `npm test` | Pasa los tests con Vitest y se queda esperando cambios (`npm test -- --watch=false` para pasarlos una vez) |
| `npm run lint` | Pasa angular-eslint sobre los `.ts` y los `.html` de `src/` |
| `npm run build` | Compila la versión de producción en `dist/backoffice/browser` |
| `npx ng generate component components/<nombre>` | Crea un componente nuevo con el CLI del proyecto |

## Pantallas

| Ruta | Pantalla | Quién entra |
|---|---|---|
| `/login` | Iniciar sesión | Solo sin sesión |
| `/register` | Crear una cuenta | Solo sin sesión |
| `/` | Inicio: saludo, rol, acceso al chat y al backoffice si es admin | Con sesión |
| `/chat` | Chat en tiempo real: general, de grupo y directo | Con sesión |
| `/authors` | Lista de autores (en tabla o en tarjetas): buscador, paginación, editar y borrar | Admin |
| `/authors/new` | Nuevo autor | Admin |
| `/authors/:id/edit` | Editar autor | Admin |
| `/books` | Lista de libros (en tabla o en tarjetas): buscador, paginación, editar y borrar | Admin |
| `/books/new` | Nuevo libro | Admin |
| `/books/:id/edit` | Editar libro | Admin |

Si se entra en una ruta sin permiso, el guard lleva al login (sin sesión) o al inicio (un `user` que
intenta entrar en el backoffice).

## Estructura del proyecto

```
src/
  main.ts                  Punto de entrada: arranca Angular sobre <app-root> de index.html
  environments/
    environment.ts         La única configuración: la URL de la API
  app/
    app.config.ts          Providers de toda la app: router y HttpClient (con el interceptor)
    app.routes.ts          El mapa de rutas: qué URL pinta qué componente
    app.ts, app.html       Componente raíz: la barra de navegación y el <router-outlet>
    components/
      navbar/              Menú de arriba: enlaces según el rol, usuario con sesión y cerrar sesión
      login/               Iniciar sesión
      register/            Crear una cuenta
      home/                Página de inicio para cualquier usuario con sesión
      chat/                Chat: pestañas general, grupo y directo, mensajes y estado de la conexión
      authors-list/        Lista de autores
      author-card/         Tarjeta de un autor (componente hijo de la lista)
      author-form/         Crear y editar autores
      books-list/          Lista de libros
      book-form/           Crear y editar libros
      pagination/          Paginación, componente hijo de las dos listas
      confirm-modal/       Ventana para confirmar antes de borrar
      view-toggle/         Botones para ver las listas en tabla o en tarjetas
    models/                Interfaces TypeScript con la forma de los datos de la API
      author.model.ts        Author, CreateAuthor, UpdateAuthor
      book.model.ts          Book, BookInput, CreateBook, UpdateBook, BOOK_LANGUAGES, BOOK_TAGS
      user.model.ts          User, UserRole y las peticiones y respuestas de /auth
    services/              Las únicas piezas que hablan con la API (HttpClient)
      auth.service.ts        register, login, refresh, logout y el usuario con sesión (signal)
      author.service.ts      getAuthors, getAuthor, createAuthor, updateAuthor, deleteAuthor
      book.service.ts        getBooks, getBook, createBook, updateBook, deleteBook
      chat.service.ts        El socket del chat: connect, joinRoom, sendMessage y los eventos como Observables
    pipes/                 Formatean datos en la plantilla
      language-name-pipe.ts  'es' -> 'Castellano'
      truncate-pipe.ts       Corta textos largos con "..."
    interceptors/
      auth.interceptor.ts  Añade el token a cada petición y lo renueva si ha caducado
    guards/
      auth.guard.ts        authGuard, adminGuard y guestGuard: quién puede entrar en cada ruta
    utils/
      api-error.ts         Pasa un error de HttpClient a un texto para la pantalla
      remove-empty.ts      Quita los campos vacíos antes de enviar un formulario
      password-match.ts    Validador: la contraseña y su repetición coinciden
```

Un dato viaja siempre por el mismo camino, igual que en el backend cada capa hace una sola cosa:

```
componente -> service (HttpClient) -> API -> respuesta -> subscribe -> signal -> la plantilla se repinta
```

Los componentes no saben de URLs ni de HTTP: piden los datos al service y guardan el resultado en una
signal. Tampoco saben del token: lo añade el interceptor a todas las peticiones.

## Autenticación

Cómo funciona por dentro (interceptor, guards, renovación del token) está en el
[apartado 13 de la GUIA](GUIA.md#13-autenticación-interceptor-y-guards). En resumen:

1. En el login, la API devuelve `{ token, refreshToken, user }` y `AuthService` lo guarda todo.
2. `authInterceptor` añade `Authorization: Bearer <token>` a cada petición.
3. El access token caduca a los 15 minutos. Cuando la API responde 401 con "El token ha caducado", el
   interceptor pide uno nuevo a `POST /auth/refresh` y repite la petición, sin que el usuario lo note.
   Si el refresh token también ha caducado (a los 7 días), cierra la sesión y lleva al login.
4. Los guards deciden qué pantallas se pueden abrir según haya sesión y según el rol.

### Dónde se guardan los tokens: localStorage o cookie HttpOnly

Los guardamos en **localStorage** (con las claves `token`, `refreshToken` y `user`). Las dos opciones
que se suelen comparar:

| | localStorage | Cookie HttpOnly |
|---|---|---|
| Quién la guarda | El frontend, con JavaScript | El backend, con la cabecera `Set-Cookie` |
| Se puede leer desde JavaScript | Sí | No |
| Riesgo principal | **XSS**: si alguien consigue ejecutar un script en la página, puede leer el token y usarlo desde otro sitio | **CSRF**: el navegador envía la cookie solo, también en peticiones que provoca otra web; hay que protegerse (`SameSite`, token anti-CSRF) |
| Qué pide | Nada especial: encaja con una API que devuelve el token en el JSON | Cambiar el backend (enviar y leer cookies) y configurar CORS con `credentials` |

Elegimos localStorage porque es lo que encaja con el contrato de la API (el token llega en el JSON del
login) y se entiende sin piezas extra. El riesgo de XSS se reduce porque Angular escapa todo lo que se
pinta en las plantillas (`{{ }}` nunca ejecuta HTML), y porque el access token dura poco. En una
aplicación real con datos sensibles, la cookie HttpOnly es la opción más segura.

Los guards y el ocultar botones son solo comodidad: quien protege los datos es el backend, que
comprueba el token y el rol en cada petición. Desde las herramientas del navegador se puede saltar un
guard, pero la API seguiría respondiendo 401 o 403.

## Chat

El chat no usa HTTP sino un WebSocket con [socket.io](https://socket.io/): una conexión que se queda
abierta para que el servidor pueda avisar en cuanto alguien escribe. Cómo está hecho por dentro
(servicio, Observables, recorrido de un mensaje) está en el
[apartado 14 de la GUIA](GUIA.md#14-chat-con-websockets); los eventos y los nombres de las salas, en
el Contrato de [LOGS.md](LOGS.md).

- **General**: la sala de todos.
- **Grupo**: se escribe un nombre (por ejemplo `seminario-7`) y entra quien escriba el mismo.
- **Directo**: se elige otro usuario de la lista. Solo pueden leerlo y escribir en él esos dos usuarios.

Arriba, la franja **Usuarios** dice quién tiene el chat abierto: disponible se muestra en verde,
**No molestar** en amarillo e **Invisible** no aparece conectado (gris). El estado se comparte con
los demás usuarios y se conserva al recargar. Pulsar un usuario abre el chat directo con él.

Al entrar en una sala llegan los últimos 50 mensajes. Para probarlo hacen falta dos sesiones a la vez,
por ejemplo una ventana normal con `admin@example.com` y una de incógnito con `user@example.com`.

## Cosas de la API que hay que saber

- Editar es un PUT y la API pide siempre los campos obligatorios (en los autores, el nombre y el
  email). Un autor no tiene contraseña ni rol: quien inicia sesión es un usuario.
- Un campo opcional que se deja vacío al editar no se borra. La API rechaza los valores vacíos, así
  que el formulario no los envía y la API deja el valor que tenía. Los tags sí se pueden vaciar: si se
  desmarcan todos se envía una lista vacía.
- Borrar es un borrado lógico: la API marca el autor o el libro como borrado y deja de devolverlo, pero
  sigue en la base de datos. Por eso un autor borrado **sigue apareciendo dentro de sus libros**.
- Los mensajes de error de validación que devuelve la API (422) vienen en inglés, de Joi.

## Cómo contribuir

Ramas, commits y pull requests en [CONTRIBUTING.md](CONTRIBUTING.md). Tareas pendientes y bitácora en
[LOGS.md](LOGS.md).
