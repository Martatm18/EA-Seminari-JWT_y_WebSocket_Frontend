import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private authService = inject(AuthService);

  ngOnInit(): void {
    // Al recargar la página, intentamos recuperar la sesión mediante la cookie HttpOnly
    this.authService.initSession().subscribe({
      error: () => {
        // Si la cookie no es válida o ha caducado, simplemente no hay sesión activa
        console.log('No hay sesión activa o la cookie ha expirado.');
      }
    });
  }
}
