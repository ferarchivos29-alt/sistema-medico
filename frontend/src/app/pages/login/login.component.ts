import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({ selector: 'app-login', templateUrl: './login.component.html' })
export class LoginComponent {
  usuario: string = '';
  password: string = '';
  mensajeError: string = '';
  cargando: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    if (!this.usuario || !this.password) {
      this.mensajeError = 'Complete todos los campos.';
      return;
    }

    this.cargando = true;
    this.mensajeError = '';

    this.http.post('https://sistema-medico-ui3n.onrender.com/api/login', { usuario: this.usuario, password: this.password }).subscribe({
      next: (res: any) => {
        this.cargando = false;
        if (res.exito) {
          this.router.navigate(['/sistema-admin']);
        }
      },
      error: (err) => {
        this.cargando = false;
        this.mensajeError = err.error?.mensaje || 'Credenciales incorrectas (admin / 123456)';
      }
    });
  }
}