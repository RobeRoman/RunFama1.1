import { Attribute, Component, input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.page.html',
  styleUrls: ['./recuperar.page.scss'],
})
export class RecuperarPage implements OnInit {

  email:String ="";
  constructor(private alertController: AlertController, private router: Router) { }

  ngOnInit() {
  }
  //ñ TENGO TECLADO EN INGLES xd
  async validarcorreo() {
    if (this.email === ''){
      await this.presentAlert('Error', 'Correo vacio');
    }else if (this.email.includes('@gmail.com') || this.email.includes('@hotmail.com') || this.email.includes('@outlook.com') || this.email.includes('@yahoo.com') || this.email.includes('@duocuc.cl'))  {
      await this.presentAlert('Bien', 'Ingrese codigo de verificacion y cambie contraseñas');
      this.router.navigate(['/cambiarclave']);
    } else {
      await this.presentAlert('Error', 'El correo no es válido');
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
