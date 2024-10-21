import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service'; // Asegúrate de que esté bien importado
import { ViajeService } from 'src/app/services/viaje.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  usuarioAutenticado: any;
  usuario: any;
  viajes: any[] = [];

  constructor(private usuarioService: UsuarioService, private viajeService: ViajeService) {}

  ngOnInit() {
    this.usuarioAutenticado = this.usuarioService.getUsuarioAutenticado();  
    this.cargarDatosUsuario(); 
    this.obtenerViaje();
  }
  
  //Pa cargar al compare users
  cargarDatosUsuario() {
    this.usuario = JSON.parse(localStorage.getItem("usuario") || '{}');
  }

  async obtenerViaje()  {
    try {
      this.viajes = await this.viajeService.getViajes();
    } catch (error){
      console.error ('Error al obtener los viaje', error);
    }
  }
}
