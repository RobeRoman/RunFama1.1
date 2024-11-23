import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UsuarioService } from '../../services/usuario.service';
import { MenuController } from '@ionic/angular';
import { FireService } from 'src/app/services/fire.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, signInWithEmailAndPassword } from '@angular/fire/auth';

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
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, this.email, this.password);
      const user = userCredential.user;
      const uid = user.uid; // Obtener el UID del usuario
      console.log('Usuario autenticado con UID:', uid);
  
      try {
        const userData = await this.fireService.getUsuarioByUID(uid);
        if (userData) {
          console.log('Datos del usuario:', userData);
  
          // Guardar el objeto del usuario en el localStorage
          localStorage.setItem('usuario', JSON.stringify(userData));
  
          // Guardar el usuario autenticado en el localStorage
          localStorage.setItem('usuarioAutenticado', JSON.stringify(userData));
  
          // Redirigir al usuario a la página principal
          this.router.navigate(['/home']);
          this.menuCtrl.enable(true);
        } else {
          console.error('El documento del usuario no existe en la base de datos.');
          this.presentAlert('Error', 'No se encontraron datos del usuario.');
        }
      } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
        this.presentAlert('Error', 'Ocurrió un problema al recuperar la información del usuario.');
      }
    } catch (error) {
      console.error('Error durante el inicio de sesión:', error);
      this.presentAlert('Error', 'Credenciales inválidas o problema de conexión.');
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
