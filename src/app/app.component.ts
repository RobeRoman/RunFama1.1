import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  isAdmin: boolean = false;

  constructor(private menu: MenuController, private router: Router) {
    // Verificar si el usuario autenticado es admin al iniciar el componente
    const usuarioAutenticado = this.getUsuarioAutenticado();
    if (usuarioAutenticado && usuarioAutenticado.tipouser === 'admin') {
      this.isAdmin = true;
    }
  }

  // Método para recuperar el usuario autenticado desde localStorage
  getUsuarioAutenticado() {
    const usuarioAutenticado = localStorage.getItem('usuario');
    return usuarioAutenticado ? JSON.parse(usuarioAutenticado) : null;
  }

  // Método para salir y limpiar la sesión
  salir() {
    localStorage.removeItem('usuario'); // Elimina el usuario del localStorage
    this.menu.close();
    this.router.navigate(['/login']);
    this.menu.enable(false); // Deshabilita el menú si es necesario
  }

  // Método para navegar a la página de administración
  administrar() {
    this.menu.close();
    this.router.navigate(['/administrar']);
  }

  // Método para navegar al perfil del usuario
  perfil() {
    this.menu.close();
    this.router.navigate(['/perfil']);
  }
}