import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class FireService {

  constructor(private fireStore: AngularFirestore, private fireAuth: AngularFireAuth) { }
  

  async crearUsuario(usuario: any){
    const docRef = this.fireStore.collection('usuarios').doc(usuario.rut);
    const docActual = await docRef.get().toPromise();
    if(docActual?.exists){
      return false;
    }

    const credencialesUsuario = await this.fireAuth.createUserWithEmailAndPassword(usuario.correo, usuario.password);
    const uid = credencialesUsuario.user?.uid;

    await docRef.set( {...usuario, uid} );
    return true;
   
  }

  getUsuarios(){
    return this.fireStore.collection('usuarios').valueChanges();
  }

  getUsuario(rut: string){
    return this.fireStore.collection('usuarios').doc(rut).valueChanges();
  }

  updateUsuario(usuario: any){
    return this.fireStore.collection('usuarios').doc(usuario.rut).update(usuario);
  }

  deleteUsuario(rut: string){
    return this.fireStore.collection('usuarios').doc(rut).delete();
  }

  getUsuarioByUID(uid: string): Promise<any> {
    return this.fireStore.collection('usuarios', ref => ref.where('uid', '==', uid))
      .get()
      .toPromise()
      .then((snapshot) => {
        // Verifica si snapshot es válido y no está vacío
        if (snapshot && !snapshot.empty) {
          return snapshot.docs[0].data(); // Devuelve el primer documento encontrado
        }
        return null; // Si no encuentra documentos o snapshot es inválido
      })
      .catch((error) => {
        console.error('Error al obtener el usuario:', error);
        return null; // Maneja errores retornando null
      });
  }

  async crearViaje(viaje: any) {
    if (!viaje.id) {
      console.error("El ID del viaje es requerido.");
      return false;
    }
  
    const docRef = this.fireStore.collection('viajes').doc(viaje.id.toString()); // Asegurarse de convertir a string
    const docActual = await docRef.get().toPromise();
  
    if(docActual && docActual.exists) {
      console.log('El viaje ya existe');
      return false;
    }
  
    // Si no existe el viaje, lo creamos
    await docRef.set({ ...viaje });
    return true;
  }

  getViajes(){
    return this.fireStore.collection('viajes').valueChanges();
  }

  getViaje(id: number){
    return this.fireStore.collection('viajes').doc(id.toString()).valueChanges();
  }

  updateViaje(viaje: any) {
    const idAsString = viaje.id.toString();
    return this.fireStore.collection('viajes').doc(idAsString).update(viaje);
  }  

  deleteViaje(id: string){
    return this.fireStore.collection('viajes').doc(id).delete();
  }

  public async getNextId(): Promise<number> {
    // Obtener todos los documentos de la colección 'viajes'
    const viajesRef = this.fireStore.collection('viajes');
    const snapshot = await viajesRef.get().toPromise();
  
    // Verificar si el snapshot es válido y no está vacío
    if (!snapshot || snapshot.empty) {
      return 1; // Si no hay viajes, comienza desde 1
    }
  
    let maxId = 0;
  
    snapshot.forEach(doc => {
      const viajeData = doc.data() as { id?: number }; // Aseguramos que 'viajeData' tiene la propiedad 'id' como número opcional
  
      // Verificar si 'id' es un número
      const id = viajeData?.id;
  
      if (typeof id === 'number') {
        maxId = Math.max(maxId, id); // Encontrar el ID más alto
      }
    });
  
    // Retornar el siguiente ID incrementado
    return maxId + 1;
  }
}
