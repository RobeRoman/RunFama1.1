import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { UsuarioService } from 'src/app/services/usuario.service'; // Asegúrate de importar el servicio

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(public usuarioService: UsuarioService, private menu: MenuController, private router: Router, ) {} // Cambiar a public

  salir(){
    localStorage.removeItem("usuario");
    this.usuarioService.setUsuarioAutenticado(null);
    this.router.navigate(['/login']);
    this.menu.close();
    this.menu.enable(false);
  }

  administrar(){
    this.menu.close();
    this.router.navigate(['/administrar']);
  }
  
  perfil(){
    this.menu.close();
    this.router.navigate(['/perfil']);
  }
}