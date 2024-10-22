import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ViajeService } from 'src/app/services/viaje.service';
import { ChangeDetectorRef } from '@angular/core'; // Importa ChangeDetectorRef

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  usuarioAutenticado: any;
  usuario: any;
  viajes: any[] = [];

  constructor(
    private usuarioService: UsuarioService,
    private viajeService: ViajeService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.usuarioAutenticado = this.usuarioService.getUsuarioAutenticado();  
    this.cargarDatosUsuario(); 

    this.viajeService.viajes$.subscribe((viajes) => {
      this.viajes = viajes;
      this.cdr.detectChanges(); 
    });

    this.obtenerViaje();
  }

  cargarDatosUsuario() {
    this.usuario = JSON.parse(localStorage.getItem("usuario") || '{}');
  }

  async obtenerViaje()  {
    this.viajes = await this.viajeService.getViajes();
  }
}
