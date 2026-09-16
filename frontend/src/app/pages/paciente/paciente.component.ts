import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Component({ selector: 'app-paciente', templateUrl: './paciente.component.html' })
export class PacienteComponent {
  dni: string = '';
  cargando: boolean = false;
  resultado: any = null;
  mensajeError: string = '';

  constructor(private http: HttpClient) {}

  buscarExamen() {
    if (!this.dni || this.dni.length !== 7) {
      this.mensajeError = '⚠️ El DNI debe tener exactamente 7 dígitos.';
      return;
    }

    this.cargando = true;
    this.resultado = null;
    this.mensajeError = '';

    this.http.get(`https://sistema-medico-ui3n.onrender.com/api/buscar/${this.dni}`).subscribe({
      next: (res: any) => {
        this.cargando = false;
        if(res.encontrado) {
          this.resultado = res;
        } else {
          this.mensajeError = res.mensaje;
        }
      },
      error: () => {
        this.cargando = false;
        this.mensajeError = 'Error de conexión con el servidor.';
      }
    });
  }
}