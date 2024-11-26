import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ViajeService } from 'src/app/services/viaje.service';
import { ChangeDetectorRef } from '@angular/core';
import * as L from 'leaflet'; // Importamos Leaflet para los mapas
import 'leaflet-routing-machine'; // Importamos la librería de rutas
import { AlertController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { FireService } from 'src/app/services/fire.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit {
  temperatura: number = 0;
  dolar: number = 0;
  usuarioAutenticado: any = {};
  usuario: any = {};
  viajes: any[] = [];
  private mapHome: L.Map | undefined; 
  private routingControlHome: L.Routing.Control | undefined; 

  constructor(
    private usuarioService: UsuarioService,
    private viajeService: ViajeService,
    private d: ChangeDetectorRef,
    private alertController: AlertController,
    private api: ApiService,
    private fireService: FireService
  ) {}

  ngOnInit() {
    const usuarioAutenticado = localStorage.getItem('usuarioAutenticado');
    console.log("Valor recuperado de localStorage:", usuarioAutenticado);
    if (usuarioAutenticado) {
      this.usuarioAutenticado = JSON.parse(usuarioAutenticado);
      this.cargarDatosUsuario(); 
    } else {
      console.error('No se encontró usuario autenticado en localStorage');
    }
  


    //this.obtenerViaje();
    this.cargarViajes();
    this.consumitWheather();
    this.consumirAPIplata();
  }

  cargarDatosUsuario() {
    this.usuario = JSON.parse(localStorage.getItem("usuario") || '{}');
  }
  /*
  async obtenerViaje() {this.viajes = await this.viajeService.getViajes();}
  */
  cargarViajes(){
    this.fireService.getViajes().subscribe(data=>{
      this.viajes = data
    });
  }


  async tomarViaje(viaje: any) {
    // Recuperamos el usuario autenticado
    const usuarioActual = JSON.parse(localStorage.getItem("usuario") || '{}');
  
    // Obtenemos los viajes actuales de Firestore para verificar si el usuario ya tomó uno
    this.fireService.getViajes().subscribe(async (viajes) => {
      // Verificamos si el usuario ya ha tomado un viaje
      const yaHaTomadoUnViaje = viajes.some((v: any) =>
        v.pasajeros.some((pasajero: any) => pasajero.rut === usuarioActual.rut)
      );
  
      if (yaHaTomadoUnViaje) {
        // Si el usuario ya ha tomado un viaje, mostramos un mensaje de error
        await this.presentAlert('Error!', 'El usuario ya ha tomado un viaje');
        console.log('El usuario ya ha tomado un viaje y no puede tomar otro.');
        return;
      }
  
      // Verificamos si hay asientos disponibles en el viaje
      if (viaje.asientos_disponible > 0) {
        // Reducimos la cantidad de asientos disponibles
        viaje.asientos_disponible -= 1;
  
        // Si ya no hay asientos disponibles, cambiamos el estado del viaje
        if (viaje.asientos_disponible === 0) {
          viaje.estado_viaje = 'tomado';
        }
  
        // Añadimos al usuario como pasajero del viaje
        viaje.pasajeros.push(usuarioActual);
  
        try {
          // Actualizamos el viaje en Firestore
          await this.fireService.updateViaje(viaje);
          // Mostramos un mensaje de éxito si la actualización fue exitosa
          await this.presentAlert('Perfecto', 'Viaje tomado correctamente');
          console.log('Viaje actualizado correctamente');
        } catch (error) {                
          await this.presentAlert('Error!', 'Hubo un error al tomar el viaje');
        }
      } 
    });
  }
  
    
  ngAfterViewInit() {
    this.initMapHome(); 
  }

  initMapHome() {
    if (this.mapHome) {
      return; 
    }

    this.mapHome = L.map('map_home').locate({ setView: true, maxZoom: 16 });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.mapHome);
    
    const fixedMarker = L.marker([-33.59850527332617, -70.5787656165388]).addTo(this.mapHome);
    fixedMarker.bindPopup("Inicia desde este punto").openPopup();
  }
  
  mostrarMapaHome(latitud: number, longitud: number) {
    if (this.mapHome) {
      if (this.routingControlHome) {
        this.mapHome.removeControl(this.routingControlHome);
      }
  
      const inicio = L.latLng(-33.59850527332617, -70.5787656165388); // Punto de inicio
      const destino = L.latLng(latitud, longitud); // Punto de destino
  
      const plan = L.Routing.plan([inicio, destino], {
        createMarker: (i, waypoint) => {
          return L.marker(waypoint.latLng, {
            draggable: false 
          }).bindPopup(i === 0 ? 'Inicio' : 'Destino').openPopup();
        }
      });
  
      this.routingControlHome = L.Routing.control({
        plan: plan,
        routeWhileDragging: false, 
        fitSelectedRoutes: true,
      }).addTo(this.mapHome);
    }
  }

  abrirDetalle(viaje: any) {
    this.mostrarMapaHome(viaje.latitud, viaje.longitud); 
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK'],
    });
    await alert.present();    
  }
  
  haTomadoElViaje(viaje: any): boolean {
    const usuarioActual = JSON.parse(localStorage.getItem("usuario") || '{}');
    return viaje.pasajeros.some((pasajero: any) => pasajero.rut === usuarioActual.rut);
  }

  consumitWheather() {
    this.api.getDatosWeather().subscribe((data: any) => {
      this.temperatura = data.properties.timeseries[0]?.data.instant.details.air_temperature;
      console.log(this.temperatura);
    });
  }

  consumirAPIplata() {
    this.api.getDatos().subscribe((data: any) => {
      this.dolar = data.dolar.valor;  // Aquí se obtiene el valor del dólar
      console.log("Valor del dólar:", this.dolar);
    });
  }

  public calcularPrecioEnDolares(precio: number): number {
    // Verificamos que el valor del dólar esté disponible y sea mayor que 0
    if (this.dolar > 0) {
      return precio / this.dolar;  // Convertimos el precio CLP a USD
    }
    return 0;  // Si no tenemos el valor del dólar, retornamos 0
  }
}
