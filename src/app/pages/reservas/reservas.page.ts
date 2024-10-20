import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ViajeService } from 'src/app/services/viaje.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

import * as L from 'leaflet';
import * as G from 'leaflet-control-geocoder';
import 'leaflet-routing-machine';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.page.html',
  styleUrls: ['./reservas.page.scss'],
})
export class ReservasPage implements OnInit {
  
  usuario: any;
  private map: L.Map | undefined;
  private geocoder: G.Geocoder | undefined;

  viaje = new FormGroup({
    id: new FormControl(),
    asientos_disponible: new FormControl('',[Validators.required, Validators.min(1), Validators.max(16)]),
    destino: new FormControl('',[Validators.required]),
    latitud: new FormControl('',[Validators.required]),
    longitud: new FormControl('',[Validators.required]),
    distancia_m: new FormControl('',[Validators.required]),
    tiempo_minutos: new FormControl(),
    precio: new FormControl(),
    estado: new FormControl('pendiente'),
    pasajeros: new FormControl([])
  });

  constructor( private router: Router,private alertController: AlertController, private usuarioService: UsuarioService, private viajeService: ViajeService) {}

  ngOnInit() {
    this.usuario = JSON.parse(localStorage.getItem("usuario") || '');
    this.initMap();
  }

  initMap(){
    // Cargar e inicializar el mapa
    this.map = L.map("map_html").locate({ setView: true, maxZoom: 16 });

    // Cargar la capa del mapa
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    // Agregar el marcador fijo en las coordenadas asignadas (punto A)
    const fixedMarker = L.marker([-33.59850527332617, -70.5787656165388]).addTo(this.map);
    fixedMarker.bindPopup("Inicia desde este punto").openPopup(); // Añadir un popup si lo deseas

    // Evento para encontrar la ubicación del usuario
    this.map.on('locationfound', (e) => {
      console.log(e.latlng.lat);
      console.log(e.latlng.lng);
    });

    // Agregar buscador de direcciones en el mapa
    this.geocoder = G.geocoder({
      placeholder: "Ingrese dirección a buscar",
      errorMessage: "Dirección no encontrada"
    }).addTo(this.map);

    // Acción al seleccionar una dirección con el geocoder
    this.geocoder.on('markgeocode', (e) => {
      const lat = e.geocode.properties['lat'];
      const lon = e.geocode.properties['lon'];

      // Actualizar el formulario con los datos del destino
      this.viaje.controls.destino.setValue(e.geocode.properties['display_name']);
      this.viaje.controls.latitud.setValue(lat);
      this.viaje.controls.longitud.setValue(lon);
      
      // Crear una ruta desde el marcador fijo hasta el destino seleccionado
      if (this.map) {
        L.Routing.control({
          waypoints: [
            L.latLng(-33.59850527332617, -70.5787656165388), // Punto A (fijo)
            L.latLng(lat, lon) // Punto B (destino seleccionado)
          ],
          fitSelectedRoutes: true
        }).on('routesfound', (e) => {
          // Actualizar el formulario con los detalles de la ruta
          this.viaje.controls.distancia_m.setValue(e.routes[0].summary.totalDistance);
          this.viaje.controls.tiempo_minutos.setValue(Math.round(e.routes[0].summary.totalTime/60));
          this.viaje.controls.precio.setValue(new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(Math.round(e.routes[0].summary.totalDistance / 1000) * 500));

        }).addTo(this.map);
      }
    });
  }

  

  async registrarViaje(){
    if (this.viaje.valid) {
      // Obtener el siguiente ID disponible
      const nextId = await this.viajeService.getNextId();
      this.viaje.controls.id.setValue(nextId);  // Asignar el nuevo ID
  
      const viaje = this.viaje.value;
      const registroV = await this.viajeService.createViaje(viaje);
  
      if (registroV) {
        await this.presentAlert('Bien', 'Viaje registrado con éxito');
        this.router.navigate(['/home']);
        this.viaje.reset();
        console.log('Viaje registrado correctamente');
      } else {
        await this.presentAlert('Error', 'No se pudo registrar el viaje');
      }
    } else {
      console.log('Formulario inválido');
      await this.presentAlert('Error', 'Formulario inválido, por favor revisa los campos.');
    }
  }
  

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK'],
    });
    await alert.present();    
  }
}
