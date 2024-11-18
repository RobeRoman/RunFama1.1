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
}
