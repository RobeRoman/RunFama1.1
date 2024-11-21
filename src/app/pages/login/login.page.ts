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
    const auth = getAuth();
    signInWithEmailAndPassword(auth, this.email, this.password)
      .then((userCredential) => {
        // Autenticación exitosa
        const user = userCredential.user;
        const uid = user.uid; // Obtener el UID del usuario
        console.log('Usuario autenticado con UID:', uid);
  
        // Usar el servicio FireService para obtener los datos del usuario
        this.fireService.getUsuarioByUID(uid)
          .then((userData) => {
            if (userData) {
              console.log('Datos del usuario:', userData);
    
              // Guardar el objeto del usuario en el localStorage
              localStorage.setItem('usuario', JSON.stringify(userData));
    
              // Redirigir al usuario a la página principal
              this.router.navigate(['/home']);
              this.menuCtrl.enable(true);
            } else {
              console.error('El documento del usuario no existe en la base de datos.');
              
            }
          })
          .catch((error) => {
            console.error('Error al obtener los datos del usuario:', error);
           
          });
      })
      .catch((error) => {
        console.error('Error durante el inicio de sesión:', error);
        console.error('Código de error:', error.code);
        console.error('Mensaje del error:', error.message);
        
      });
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
