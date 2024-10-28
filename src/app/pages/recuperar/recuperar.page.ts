import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.page.html',
  styleUrls: ['./recuperar.page.scss'],
})
export class RecuperarPage implements OnInit {

  email: string = "";

  constructor(
    private alertController: AlertController,
    private router: Router,
    private storage: Storage // Inyectar Storage de Ionic
  ) { }

  async ngOnInit() {
    // Inicializar el storage
    await this.storage.create();
  }

  async validarcorreo() {
    if (this.email === '') {
      await this.presentAlert('Error', 'Correo vacío');
    } else {
      // Obtener usuarios desde Ionic Storage
      const usuarios = await this.storage.get('usuarios') || [];
      const correoValido = usuarios.some((user: any) => user.correo === this.email);
      
      if (correoValido) {
        await this.presentAlert('Bien', 'Ingrese código de verificación y cambie contraseñas');
        this.router.navigate(['/cambiarclave']);
      } else {
        await this.presentAlert('Error', 'El correo no es válido');
      }
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
