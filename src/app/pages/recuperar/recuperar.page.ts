import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.page.html',
  styleUrls: ['./recuperar.page.scss'],
})
export class RecuperarPage implements OnInit {

  
  email:String ="";
  password:String ="";

  constructor(private alertController: AlertController) { }

  ngOnInit() {
  }

  async recoverPassword() {
    if (this.email === "runfama@gmail.com") {
      const alert = await this.alertController.create({
        header: 'Contraseña Recuperada',
        message: 'Tu contraseña es: runfama',
        buttons: ['OK']
      });
      await alert.present();
    } else {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'no se puedo recuperar la contraseña .',
        buttons: ['OK']
      });
      await alert.present();
    }
  }    
}
