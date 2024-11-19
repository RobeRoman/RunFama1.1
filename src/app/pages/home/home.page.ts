import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ViajeService } from 'src/app/services/viaje.service';
import { ChangeDetectorRef } from '@angular/core';
import * as L from 'leaflet'; // Importamos Leaflet para los mapas
import 'leaflet-routing-machine'; // Importamos la librería de rutas
import { AlertController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit {
  
  dolar: number = 0;
  usuarioAutenticado: any;
  usuario: any;
  viajes: any[] = [];
  private mapHome: L.Map | undefined; 
  private routingControlHome: L.Routing.Control | undefined; 

  constructor(
    private usuarioService: UsuarioService,
    private viajeService: ViajeService,
    private d: ChangeDetectorRef,
    private alertController: AlertController,
    private api: ApiService
  ) {}

  ngOnInit() {
    this.usuarioAutenticado = this.usuarioService.getUsuarioAutenticado();  
    this.cargarDatosUsuario(); 

    this.viajeService.viajes$.subscribe((viajes) => {
      this.viajes = viajes;
      this.d.detectChanges(); 
    });

    this.obtenerViaje();
    this.consumitWheather();
    this.consumirAPIplata();
  }

  cargarDatosUsuario() {
    this.usuario = JSON.parse(localStorage.getItem("usuario") || '{}');
  }
  
  async obtenerViaje() {
    this.viajes = await this.viajeService.getViajes();
  }
  
  async tomarViaje(viaje: any) {
    
    const usuarioActual = JSON.parse(localStorage.getItem("usuario") || '{}');
      
    const viajes = await this.viajeService.getViajes();
    const yaHaTomadoUnViaje = viajes.some((v: any) =>
      v.pasajeros.some((pasajero: any) => pasajero.rut === usuarioActual.rut)
    );
  
    if (yaHaTomadoUnViaje) {
      await this.presentAlert('Error!', 'El usuario ya ha tomado un viaje');
      console.log('El usuario ya ha tomado un viaje y no puede tomar otro.');
      return;
    }
    
    if (viaje.asientos_disponible > 0) {  
      viaje.asientos_disponible -= 1;
      
      if (viaje.asientos_disponible === 0) {
        viaje.estado_viaje = 'tomado';
      }
      
      viaje.pasajeros.push(usuarioActual);
      
      const actualizado = await this.viajeService.updateViaje(viaje.id, viaje);
      if (actualizado) {
        await this.presentAlert('Perfecto', 'Viaje tomado correctamente');
        console.log('Viaje actualizado correctamente');
      } else {
        console.log('Error al actualizar el viaje');
      }
    } else {
      console.log('No hay asientos disponibles.');
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

  consumitWheather(){
    this.api.getDatosWeather().subscribe((data:any)=>{
      console.log(data);
    });
  }

  consumirAPIplata(){
    this.api.getDatos().subscribe((data:any) => {
      this.dolar = data.dolar.valor;  // Aquí obtienes el valor del dólar
      console.log(this.dolar);
    });
  }
}
