import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViajeService {
  private viajesSubject = new BehaviorSubject<any[]>([]);
  viajes$ = this.viajesSubject.asObservable();

  constructor(private storage: Storage) {
    this.init();
    this.cargarViajes(); // Cargar los viajes almacenados en el subject al iniciar
  }

  async init() {
    await this.storage.create();
  }

  private async cargarViajes() {
    let viajes: any[] = await this.storage.get("viajes") || [];
    this.viajesSubject.next(viajes); 
  }

  public async createViaje(viaje: any): Promise<boolean> {
    let viajes: any[] = await this.storage.get("viajes") || [];
    if (viajes.find(v => v.id == viaje.id) != undefined) {
      return false;
    }
    viajes.push(viaje);
    await this.storage.set("viajes", viajes);
    this.viajesSubject.next(viajes); 
    return true;
  }

  public async getViaje(id: string): Promise<any> {
    const viajes: any[] = await this.storage.get("viajes") || [];
    console.log("Viajes recuperados en getViaje:", viajes);
    const viajeEncontrado = viajes.find(v => v.id.toString() === id.toString());
    if (!viajeEncontrado) {
      console.warn(`No se encontró un viaje con el ID: ${id}`);
    }
    return viajeEncontrado;
  }
  
  public async getViajes(): Promise<any[]> {
    let viajes: any[] = await this.storage.get("viajes") || [];
    return viajes;
  }

  public async updateViaje(id: string, nuevoViaje: any): Promise<boolean> {
    let viajes: any[] = await this.storage.get("viajes") || [];
    let indice: number = viajes.findIndex(v => v.id === id);
    if (indice === -1) {
      return false;
    }
    viajes[indice] = nuevoViaje;
    await this.storage.set("viajes", viajes);
    this.viajesSubject.next(viajes); 
    return true;
  }

  public async deleteViaje(id: string): Promise<boolean> {
    let viajes: any[] = await this.storage.get("viajes") || [];
    let indice: number = viajes.findIndex(v => v.id === id);
    if (indice === -1) {
      return false;
    }
    viajes.splice(indice, 1);
    await this.storage.set("viajes", viajes);
    this.viajesSubject.next(viajes); 
    return true;
  }

  public async getNextId(): Promise<number> {
    let viajes: any[] = await this.storage.get("viajes") || [];
    if (viajes.length === 0) {
      return 1;  
    }
    let maxId = Math.max(...viajes.map(v => v.id));
    return maxId + 1;
  }

  // Método para guardar el viaje en el historial
  public async guardarEnHistorial(viaje: any): Promise<boolean> {
    let historial: any[] = await this.storage.get("historial") || [];

    // Guardamos solo la información relevante del viaje que quieres en el historial
    const viajeHistorial = {
        id: viaje.id,
        conductor: viaje.conductor,
        asientos_disponibles: viaje.asientos_disponibles,
        destino: viaje.destino,
        latitud: viaje.latitud,
        longitud: viaje.longitud,
        distancia_m: viaje.distancia_m,
        tiempo_minutos: viaje.tiempo_minutos,
        precio: viaje.precio,
        estado: viaje.estado,
        // Puedes añadir otros campos que necesites
    };

    historial.push(viajeHistorial); // Añadir el viaje al historial

    // Guardamos el historial actualizado en el almacenamiento
    await this.storage.set("historial", historial);
    return true; // Retorna verdadero si se guarda correctamente
}

  // Método para obtener el historial de viajes
  public async getHistorial(): Promise<any[]> {
    let historial: any[] = await this.storage.get("historial") || [];
    return historial;
  }


  public async limpiarHistorial(): Promise<boolean> {
    await this.storage.set("historial", []); // Establecer el historial como un array vacío
    return true; // Retorna verdadero si se limpia correctamente
}
}
