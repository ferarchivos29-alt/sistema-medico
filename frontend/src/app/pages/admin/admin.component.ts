import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
@Component({ selector: 'app-admin', templateUrl: './admin.component.html' })
export class AdminComponent {
  dni: string = '';
  archivo: File | null = null;
  mensaje: string = '';
  exito: boolean = false;
  cargando: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  onFileSelected(event: any) { this.archivo = event.target.files[0]; }

  subir() {
    if (!this.dni || this.dni.length !== 7 || !this.archivo) {
      this.exito = false;
      this.mensaje = '⚠️ El DNI debe tener exactamente 7 dígitos y debes seleccionar un archivo.';
      return;
    }

    this.cargando = true;
    const formData = new FormData();
    formData.append('dni', this.dni);
    formData.append('examen', this.archivo);

    this.http.post('http://localhost:3000/api/upload', formData).subscribe({
      next: (res: any) => {
        this.cargando = false; 
        this.exito = true; 
        this.mensaje = res.mensaje;
        this.dni = ''; 
        this.archivo = null;
      },
      error: () => {
        this.cargando = false; 
        this.exito = false; 
        this.mensaje = 'Error subiendo al servidor local.';
      }
    });
  }

  cerrarSesion() {
    this.router.navigate(['/login']);
  }
}