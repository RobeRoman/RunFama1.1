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
    this.onTieneAutoChange();
  }

  persona = new FormGroup({
    rut: new FormControl('', [Validators.required, Validators.pattern("[0-9]{7,8}-[0-9kK]{1}")]),
    nombre: new FormControl('', [Validators.required, Validators.pattern("[a-zA-Z]{3,15}")]), 
    fecha_nacimiento: new FormControl('', [Validators.required]),                             
    correo: new FormControl('',[Validators.required, Validators.pattern("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}")]),
    password: new FormControl('',[Validators.required, Validators.minLength(4)]),
    genero: new FormControl('', [Validators.required]),                                       
    sede: new FormControl('', [Validators.required]),                                         
    tiene_auto: new FormControl('no', [Validators.required]),
    marca_auto: new FormControl('', []),
    patente: new FormControl('', []),
    asientos_disp: new FormControl('', [])
  });

  usuarios: any[] = [];

  onTieneAutoChange() {
    this.persona.get('tiene_auto')?.valueChanges.subscribe(value => {
      if (value === 'si') {
        // Si el usuario tiene auto, agregar validaciones
        this.persona.get('marca_auto')?.setValidators([Validators.required]);
        this.persona.get('patente')?.setValidators([Validators.required]);
        this.persona.get('asientos_disp')?.setValidators([Validators.required, Validators.min(1), Validators.max(10)]);
      } else {
        // Si no tiene auto, eliminar validaciones
        this.persona.get('marca_auto')?.clearValidators();
        this.persona.get('patente')?.clearValidators();
        this.persona.get('asientos_disp')?.clearValidators();
      }
      // Actualizar el estado de validación de los campos
      this.persona.get('marca_auto')?.updateValueAndValidity();
      this.persona.get('patente')?.updateValueAndValidity();
      this.persona.get('asientos_disp')?.updateValueAndValidity();
    });
  }

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