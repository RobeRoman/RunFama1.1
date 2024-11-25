import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ViajeService } from 'src/app/services/viaje.service';
import { FormControl, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

import * as L from 'leaflet';
import * as G from 'leaflet-control-geocoder';
import 'leaflet-routing-machine';
import { FireService } from 'src/app/services/fire.service';

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
    conductor: new FormControl('', [Validators.required]),
    asientos_disponible: new FormControl('', [Validators.required, Validators.min(1), Validators.max(16)]),
    destino: new FormControl('', [Validators.required]),
    latitud: new FormControl('', [Validators.required]),
    longitud: new FormControl('', [Validators.required]),
    distancia_m: new FormControl('', [Validators.required]),
    tiempo_minutos: new FormControl(),
    precio: new FormControl(),
    estado: new FormControl('pendiente'),
    pasajeros: new FormControl([])
  });

  constructor(private router: Router, 
              private alertController: AlertController, 
              private usuarioService: UsuarioService, 
              private viajeService: ViajeService,
              private fireService: FireService) {}

  ngOnInit() {
    this.usuario = JSON.parse(localStorage.getItem("usuario") || '');
    this.viaje.controls.conductor.setValue(this.usuario.nombre);

    // Aplicar el validador de asientos basados en los asientos del auto del usuario
    if (this.usuario.tiene_auto === 'si') {
      this.viaje.controls.asientos_disponible.setValidators([
        Validators.required,
        Validators.min(1),
        Validators.max(this.usuario.asientos_disp), // Máximo de asientos del auto del usuario
        this.validarAsientosViaje() // Validador personalizado
      ]);
    }

    this.initMap();
  }

  // Validador personalizado para verificar asientos
  validarAsientosViaje(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const asientosViaje = control.value;
      const asientosAuto = this.usuario?.asientos_disp;
      if (asientosViaje > asientosAuto) {
        return { asientosExcedidos: true };
      }
      return null;
    };
  }

  initMap() {
    // Cargar e inicializar el mapa
    this.map = L.map("map_html").locate({ setView: true, maxZoom: 16 });

    // Cargar la capa del mapa
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    // Agregar el marcador fijo en las coordenadas asignadas (punto A)
    const fixedMarker = L.marker([-33.59850527332617, -70.5787656165388]).addTo(this.map);
    fixedMarker.bindPopup("Inicia desde este punto").openPopup();

    this.map.on('locationfound', (e) => {
      console.log(e.latlng.lat);
      console.log(e.latlng.lng);
    });

    // Agregar buscador de direcciones en el mapa
    this.geocoder = G.geocoder({
      placeholder: "Ingrese dirección a buscar",
      errorMessage: "Dirección no encontrada"
    }).addTo(this.map);

    this.geocoder.on('markgeocode', (e) => {
      const lat = e.geocode.properties['lat'];
      const lon = e.geocode.properties['lon'];
      this.viaje.controls.destino.setValue(e.geocode.properties['display_name']);
      this.viaje.controls.latitud.setValue(lat);
      this.viaje.controls.longitud.setValue(lon);
      
      if (this.map) {
        L.Routing.control({
          waypoints: [
            L.latLng(-33.59850527332617, -70.5787656165388),
            L.latLng(lat, lon)
          ],
          fitSelectedRoutes: true
        }).on('routesfound', (e) => {
          this.viaje.controls.distancia_m.setValue(e.routes[0].summary.totalDistance);
          this.viaje.controls.tiempo_minutos.setValue(Math.round(e.routes[0].summary.totalTime / 60));
          this.viaje.controls.precio.setValue((Math.round(e.routes[0].summary.totalDistance / 1000) * 500));
        }).addTo(this.map);
      }
    });
  }

  async registrarViaje() {
    if (this.viaje.valid) {
      const nextId = await this.fireService.getNextId();
      this.viaje.controls.id.setValue(nextId);
  
      const viaje = this.viaje.value;
      
      const registroViaje = await this.fireService.crearViaje(viaje);
      if (registroViaje) {
        await this.presentAlert('Bien', 'El viaje ha sido registrado con éxito!');
        this.viaje.reset();
        console.log('Viaje registrado');
      } else {
        console.log('Formulario inválido');
        await this.presentAlert('Error', 'El Formulario del registro es inválido, complete los campos');
      }
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
