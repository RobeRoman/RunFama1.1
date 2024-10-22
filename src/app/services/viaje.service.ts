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

  // Cargar los viajes al iniciar el servicio y emitirlos al BehaviorSubject
  private async cargarViajes() {
    let viajes: any[] = await this.storage.get("viajes") || [];
    this.viajesSubject.next(viajes); 
  }

  public async createViaje(viaje: any): Promise<boolean> {
    let viajes: any[] = await this.storage.get("viajes") || [];
    if (viajes.find(v=>v.id==viaje.id) != undefined) {
      return false;
    }
    viajes.push(viaje);
    await this.storage.set("viajes", viajes);
    this.viajesSubject.next(viajes); 
    return true;
  }

  public async getViaje(id: string): Promise<any> {
    let viajes: any[] = await this.storage.get("viajes") || [];
    return viajes.find(v => v.id === id);
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
    this.viajesSubject.next(viajes); // Emitir los viajes actualizados
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
    this.viajesSubject.next(viajes); // Emitir los viajes después de la eliminación
    return true;
  }

  public async getNextId(): Promise<number> {
    let viajes: any[] = await this.storage.get("viajes") || [];
    if (viajes.length === 0) {
      return 1;  // Si no hay viajes, comienza desde 1
    }
    let maxId = Math.max(...viajes.map(v => v.id));
    return maxId + 1;
  }
}
