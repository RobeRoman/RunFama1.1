import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ViajeService } from 'src/app/services/viaje.service';

@Component({
  selector: 'app-detalles-reservas',
  templateUrl: './detalles-reservas.page.html',
  styleUrls: ['./detalles-reservas.page.scss'],
})
export class DetallesReservasPage implements OnInit {
  id: string = '';
  conductor: string = '';
  asientos_disponibles: number = 0;
  destino: string = '';
  latitud: number = 0;
  longitud: number = 0;
  distancia_m: number= 0;
  tiempo_minutos: number=0;
  precio: number= 0;
  estado: string = ''
  
  capitalize(text: string): string {
    return text ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : '';
  }
  
  constructor(private activaedRoute: ActivatedRoute, private viajeService: ViajeService) { }
  ngOnInit() {
    setTimeout(() => {
    }, 2000); 

    this.id = (this.activaedRoute.snapshot.paramMap.get("id")|| '0');
    this.viajeService.getViaje(this.id).then((viaje: any) => {
      if(viaje){
        this.conductor = viaje.conductor || '';
        this.asientos_disponibles = Number(viaje.asientos_disponibles) || 0;
        this.destino = viaje.destino;
        this.latitud = viaje.latitud || 0;
        this.longitud = viaje.longitud || 0;
        this.distancia_m = viaje.distancia_m || 0; 
        this.tiempo_minutos = viaje.tiempo_minutos || 0;
        this.precio = viaje.precio || 0;
        this.estado = this.capitalize(viaje.estado || 'Sin estado');
      }
    });
  }

}
