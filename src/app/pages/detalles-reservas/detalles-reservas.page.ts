import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ViajeService } from 'src/app/services/viaje.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-detalles-reservas',
  templateUrl: './detalles-reservas.page.html',
  styleUrls: ['./detalles-reservas.page.scss'],
})
export class DetallesReservasPage implements OnInit {
  selectedSegment: 'viaje' | 'historial' = 'viaje'; // Cambiado a unión de tipos
  historial: any[] = []; // Array para almacenar el historial de viajes

  id: string = '';
  conductor: string = '';
  asientos_disponibles: number = 0;
  destino: string = '';
  latitud: number = 0;
  longitud: number = 0;
  distancia_m: number = 0;
  tiempo_minutos: number = 0;
  precio: number = 0;
  estado: string = '';
  viaje: any; // Declare the viaje property

  constructor(
    private activatedRoute: ActivatedRoute,
    private viajeService: ViajeService,
    private alertController: AlertController // Inject the AlertController
  ) {}

  // Este método se ejecutará cada vez que entres a la página
  ionViewWillEnter() {
    this.cargarDetalles();
    this.cargarHistorial(); // Cargar el historial al entrar
  }

  private async cargarDetalles() {
    this.id = this.activatedRoute.snapshot.paramMap.get("id") || '0';
    this.viajeService.getViaje(this.id).then((viaje: any) => {
      if (viaje) {
        this.conductor = viaje.conductor || '';
        this.asientos_disponibles = Number(viaje.asientos_disponibles) || 0;
        this.destino = viaje.destino || 'No especificado';
        this.latitud = viaje.latitud || 0;
        this.longitud = viaje.longitud || 0;
        this.distancia_m = viaje.distancia_m || 0;
        this.tiempo_minutos = viaje.tiempo_minutos || 0;
        this.precio = viaje.precio;
        this.estado = this.capitalize(viaje.estado || 'Sin estado');
        this.viaje = viaje; // Save the viaje object for later use
      }
    });
  }

  // Método para cargar el historial de viajes
  private async cargarHistorial() {
    this.historial = await this.viajeService.getHistorial(); // Obtener el historial
  }

  // Método para capitalizar el estado
  capitalize(text: string): string {
    return text ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : '';
  }

  // Método para finalizar el viaje
  async finalizarViaje() {
    const usuarioActual = JSON.parse(localStorage.getItem("usuario") || '{}');
    
    const index = this.viaje.pasajeros.findIndex((pasajero: any) => pasajero.rut === usuarioActual.rut);

    if (index !== -1) {
        this.viaje.pasajeros.splice(index, 1);
        this.viaje.asientos_disponibles += 1; 

        if (this.viaje.asientos_disponibles > 0) {
            this.viaje.estado = 'disponible'; 
        }

        const actualizado = await this.viajeService.updateViaje(this.viaje.id, this.viaje);
        if (actualizado) {
            await this.presentAlert('Viaje Finalizado', 'El viaje se ha finalizado correctamente.');
            console.log('Viaje actualizado correctamente');

            // Guardar el viaje en el historial
            const guardadoHistorial = await this.viajeService.guardarEnHistorial(this.viaje);
            if (guardadoHistorial) {
                console.log('Viaje guardado en el historial correctamente');
                await this.cargarHistorial(); // Recargar el historial después de guardar
            } else {
                console.log('Error al guardar el viaje en el historial');
            }
        } else {
            console.log('Error al actualizar el viaje');
        }
    } else {
        await this.presentAlert('Error', 'No se pudo encontrar el pasajero en este viaje.');
    }
  }

  async limpiarHistorial() {
    const resultado = await this.viajeService.limpiarHistorial();
    if (resultado) {
        this.historial = []; // Limpiar el array de historial en el componente
        await this.presentAlert('Historial Limpiado', 'El historial ha sido limpiado correctamente.');
    } else {
        await this.presentAlert('Error', 'No se pudo limpiar el historial.');
    }
}

  // Método para presentar alertas
  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  ngOnInit() {}
}