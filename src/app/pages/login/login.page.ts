import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UsuarioService } from '../../services/usuario.service';
import { MenuController } from '@ionic/angular';
import { FireService } from 'src/app/services/fire.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, signInWithEmailAndPassword, user } from '@angular/fire/auth';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string = "";
  password: string = "";
  failedAttempts: number = 0;
  lockTime: number = 0; // Tiempo restante para desbloquear
  lockInterval: any; // Para manejar el setTimeout

  constructor(
    private alertController: AlertController,
    private router: Router,
    private usuarioService: UsuarioService,
    private menuCtrl: MenuController,
    private fireService: FireService,
    private fireAuth: AngularFireAuth
  ) { }

  ngOnInit() {
    this.menuCtrl.enable(false);
   }

   async login() {
    console.log('Email:', this.email);
    console.log('Password:', this.password);

    // Simulando la autenticación
    const authenticated = await this.usuarioService.authenticate(this.email, this.password);
    if (authenticated) {
      console.log('Autenticado');
      this.failedAttempts = 0; // Reiniciar intentos fallidos
      await this.router.navigate(['/home']);
      this.menuCtrl.enable(true);
    } else {
      console.log('Autenticación fallida');
      this.failedAttempts++;
      if (this.failedAttempts >= 3) {
        this.lockTime = 15; // Bloquear por 15 segundos
        this.startLockTimer();
      }
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

  startLockTimer() {
    this.lockInterval = setInterval(() => {
      this.lockTime--;
      if (this.lockTime <= 0) {
        clearInterval(this.lockInterval);
      }
    }, 1000);
  }
}
