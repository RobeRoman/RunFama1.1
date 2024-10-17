import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private usuarioAutenticado: any = null; // Añadir propiedad para el usuario autenticado

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    await this.storage.create();
    
    // Recuperar usuario del localStorage
    const usuario = localStorage.getItem("usuario");
    this.usuarioAutenticado = usuario ? JSON.parse(usuario) : null;

    // Opcional: crear usuarios de ejemplo si es necesario
    const admin = {
        rut: '12345678-9',
        correo: 'admin@duocuc.cl',
        password: 'admin123',
        nombre: 'Admin',
        fecha_nacimiento: '1990-01-01',
        genero: 'masculino',
        sede: 'Puente alto',
        tiene_auto: 'si',
        marca_auto: 'Toyota',
        patente: 'ABCD12',
        asientos_disp: 4,
        tipouser: 'admin'
    };
    
    const renepuente = {
        rut: '21380169-2',
        correo: 'rene@duocuc.cl',
        password: 'rene12345678',
        nombre: 'Rene',
        fecha_nacimiento: '2003-02-09',
        genero: 'masculino',
        sede: 'Puente alto',
        tiene_auto: 'no',
        tipouser: 'admin'
    };
    
    await this.createUsuario(admin);
    await this.createUsuario(renepuente);
}

  public async createUsuario(usuario: any): Promise <boolean> {
    let usuarios: any[] = await this.storage.get("usuarios") || [];
    if(usuarios.find(usu=>usu.rut==usuario.rut)!=undefined){
      return false;
    }
    usuarios.push(usuario);
    await this.storage.set("usuarios", usuarios);
    return true;
  }

  public async getUsuario(rut: string): Promise <any> {
    let usuarios: any[] = await this.storage.get("usuarios") || [];
    return usuarios.find(usu=>usu.rut==rut)
  }

  public async getUsuarios():Promise <any[]> {
    let usuarios: any[] = await this.storage.get("usuarios") ||[];
    return usuarios;
  }

  public async updateUsuario(rut: string, nuevoUsuario: any): Promise<boolean>{
    let usuarios: any[] = await this.storage.get("usuarios") || []
    let indice: number = usuarios.findIndex(usu=>usu.rut==rut);
    if (indice==-1){
      return false;
    }
    usuarios[indice] = nuevoUsuario;
    await this.storage.set("usuarios", usuarios);
    return true;
  }

  public async deleteUsuario(rut: string): Promise <boolean> {
    let usuarios: any[] = await this.storage.get("usuarios") || [];
    let indice: number = usuarios.findIndex(usu=>usu.rut==rut);
    if(indice==-1){
      return false;
    }
    usuarios.splice(indice,1);
    await this.storage.set("usuarios", usuarios);
    return true;
  }

  //Nose si esta bien
  public async authenticate(email: string, password: string): Promise<boolean> {
    let usuarios: any[] = await this.storage.get("usuarios") || [];
    const usu = usuarios.find(elemento => elemento.correo === email && elemento.password === password);
    
    if (usu) {
        // Almacena la información en localStorage
        localStorage.setItem("usuario", JSON.stringify(usu));
        
        // Actualiza la propiedad usuarioAutenticado
        this.usuarioAutenticado = usu;
        return true;
    }
    
    return false;
  }


  public getUsuarioAutenticado() {
    return this.usuarioAutenticado; // Obtener usuario autenticado
  }

  public setUsuarioAutenticado (usuario: any){
    this.usuarioAutenticado = usuario;
  }

}


