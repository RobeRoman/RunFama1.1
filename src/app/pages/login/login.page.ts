import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UsuarioService } from '../../services/usuario.service'; // Asegúrate de importar el servicio

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string = "";
  password: string = "";

  constructor(
    private alertController: AlertController,
    private router: Router,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit() { }

  async login() {
    console.log('Email:', this.email);
    console.log('Password:', this.password);

    if (this.usuarioService.authenticate(this.email, this.password)) {
      console.log('Autnetificado');
      await this.router.navigate(['/home']);
    } else {
      console.log('Authentication failed');
      await this.presentAlert('Error', 'El correo o la contraseña no son válidos');
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