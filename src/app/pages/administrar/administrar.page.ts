import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-administrar',
  templateUrl: './administrar.page.html',
  styleUrls: ['./administrar.page.scss'],
})
export class AdministrarPage implements OnInit {

  constructor(private alertController: AlertController, private usuarioService: UsuarioService) { }

  ngOnInit() {
    this.usuarios = this.usuarioService.getUsuarios();
  }
  persona = new FormGroup({
    rut: new FormControl('', [Validators.required, Validators.pattern("[0-9]{7,8}-[0-9kK]{1}")]),
    nombre: new FormControl('', [Validators.required, Validators.pattern("[a-zA-Z]{3,15}")]), //Bien
    fecha_nacimiento: new FormControl('', [Validators.required]),                             
    correo: new FormControl('',[Validators.required,  Validators.pattern("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}")]),
    password: new FormControl('',[Validators.required, Validators.minLength(4)]),
    genero: new FormControl('', [Validators.required]),                                       //Bien
    sede: new FormControl('', [Validators.required]),                                         //Bien
    tiene_auto: new FormControl('no', [Validators.required]),                                 //Bien
    
    //ESTO SE HARA LUEGO, PRIMERO SE TIENE QUE CORREGUIR LAS VALIDACIONES ANTERIORES
    marca_auto: new FormControl('', []),
    patente: new FormControl('', []),
    asientos_disp: new FormControl('', []),
  });
  usuarios: any[] = [];

  async registrar() {            
    if( this.usuarioService.createUsuario(this.persona.value) ){
      await this.presentAlert('Perfecto!', 'Registrado correctamente');
      this.persona.reset();
    }else{
      await this.presentAlert('Error!', 'El usuario no se pudo registrar');
    }
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK'],
    });
    await alert.present();    
  }

}
