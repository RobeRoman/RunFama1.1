import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ViajeService } from 'src/app/services/viaje.service';
import { ChangeDetectorRef } from '@angular/core';
import * as L from 'leaflet'; // Importamos Leaflet para los mapas
import 'leaflet-routing-machine'; // Importamos la librería de rutas
import { AlertController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { FireService } from 'src/app/services/fire.service';
import { firstValueFrom } from 'rxjs';

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
      //this.cargarDatosUsuario(); 
    } else {
      console.error('No se encontró usuario autenticado en localStorage');
    }

    //this.obtenerViaje();
    this.cargarViajes();
    this.consumitWheather();
    this.consumirAPIplata();
    this.cargarDatosUsuario(); 
  }

  cargarDatosUsuario() {
    this.usuario = JSON.parse(localStorage.getItem("usuario") || '{}');
  }
  
  cargarViajes(){
    this.fireService.getViajes().subscribe(data=>{
      this.viajes = data
    });
  }


  async tomarViaje(viaje: any) {
    try {
      console.log("Iniciando el método tomarViaje");
  
      // Recuperamos el usuario autenticado
      const usuarioActual = JSON.parse(localStorage.getItem("usuario") || '{}');
      console.log("Usuario actual recuperado del localStorage:", usuarioActual);
  
      // Obtenemos los viajes actuales de Firestore de forma sincronizada
      const viajes = await firstValueFrom(this.fireService.getViajes());
      console.log('Viajes actuales recuperados de Firestore:', viajes);
  
      // Verificamos si el usuario ya ha tomado un viaje
      const yaHaTomadoUnViaje = viajes.some((v: any) =>
        v.pasajeros.some((pasajero: any) => pasajero.rut === usuarioActual.rut)
      );
      console.log('¿El usuario ya ha tomado un viaje?:', yaHaTomadoUnViaje);
  
      if (yaHaTomadoUnViaje) {
        await this.presentAlert("Error!", "El usuario ya ha tomado un viaje");
        console.log("El usuario ya ha tomado un viaje y no puede tomar otro.");
        return; // Detenemos el flujo
      }
  
      // Verificamos si hay asientos disponibles
      console.log("Asientos disponibles en el viaje:", viaje.asientos_disponible);
      if (viaje.asientos_disponible > 0) {
        viaje.asientos_disponible -= 1;
        console.log("Asientos disponibles después de la reducción:", viaje.asientos_disponible);
  
        if (viaje.asientos_disponible === 0) {
          viaje.estado_viaje = "tomado";
        }
  
        viaje.pasajeros.push(usuarioActual);
  
        console.log("Datos del viaje que se intentan actualizar:", viaje);
  
        try {
          await this.fireService.updateViaje(viaje); // Actualizamos el viaje
          await this.presentAlert("Perfecto", "Viaje tomado correctamente");
          console.log("Viaje actualizado correctamente");
        } catch (error) {
          console.error("Error al actualizar el viaje:", error);
          await this.presentAlert("Error!", "Hubo un error al tomar el viaje");
        }
      } else {
        console.log("No hay asientos disponibles para este viaje.");
        await this.presentAlert("Error!", "No hay asientos disponibles");
      }
    } catch (error) {
      console.error("Error general en el método tomarViaje:", error);
    }
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
