import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ViajeService } from 'src/app/services/viaje.service';
import { ChangeDetectorRef } from '@angular/core';
import * as L from 'leaflet'; // Importamos Leaflet para los mapas
import 'leaflet-routing-machine'; // Importamos la librería de rutas

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit {
  usuarioAutenticado: any;
  usuario: any;
  viajes: any[] = [];
  private mapHome: L.Map | undefined; // Cambiar el nombre de la variable del mapa para que sea única
  private routingControlHome: L.Routing.Control | undefined; // Control de rutas exclusivo para el HomePage

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

  // Cargar datos del usuario
  cargarDatosUsuario() {
    this.usuario = JSON.parse(localStorage.getItem("usuario") || '{}');
  }

  // Obtener los viajes
  async obtenerViaje() {
    this.viajes = await this.viajeService.getViajes();
  }

  // Inicializa el mapa después de que la vista esté lista
  ngAfterViewInit() {
    this.initMapHome(); // Inicializamos el mapa una vez que la vista está lista
  }

  // Inicializa el mapa específico para la página Home
  initMapHome() {
    if (this.mapHome) {
      return; // Si el mapa ya existe, no lo volvemos a inicializar
    }

    this.mapHome = L.map('map_home').locate({ setView: true, maxZoom: 16 });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.mapHome);

    // Agregar un marcador fijo al mapa
    const fixedMarker = L.marker([-33.59850527332617, -70.5787656165388]).addTo(this.mapHome);
    fixedMarker.bindPopup("Inicia desde este punto").openPopup();
  }

  // Muestra el mapa y traza una ruta a partir de un destino seleccionado
  mostrarMapaHome(latitud: number, longitud: number) {
    if (this.mapHome) {
      // Limpiar rutas previas
      if (this.routingControlHome) {
        this.mapHome.removeControl(this.routingControlHome);
      }

      // Definir puntos de inicio y destino
      const inicio = L.latLng(-33.59850527332617, -70.5787656165388); // Punto A (fijo)
      const destino = L.latLng(latitud, longitud); // Punto B (destino)

      // Crear la ruta en el mapa
      this.routingControlHome = L.Routing.control({
        waypoints: [inicio, destino],
        routeWhileDragging: true, // Permitir ajustar la ruta arrastrando
        fitSelectedRoutes: true,  // Ajustar el zoom a la ruta
      }).addTo(this.mapHome);
    }
  }

  // Método para abrir el detalle de un viaje y mostrar la ruta en el mapa
  abrirDetalle(viaje: any) {
    this.mostrarMapaHome(viaje.latitud, viaje.longitud); // Mostrar el mapa con las coordenadas del viaje seleccionado
  }
}
