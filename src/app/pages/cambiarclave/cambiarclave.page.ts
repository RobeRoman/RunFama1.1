import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-cambiarclave',
  templateUrl: './cambiarclave.page.html',
  styleUrls: ['./cambiarclave.page.scss'],
})
export class CambiarclavePage implements OnInit {

  code:String="";
  pass1:String="";
  pass2:String="";

  constructor(private alertController: AlertController, private router: Router) { }

  ngOnInit() {
  }

  async cambio(){

    if(this.pass1==='' || this.pass2 === "" ||this.code === ""){
      console.log("Vacios");
      await this.presentAlert('Error', 'Ingrese campos');
    }else if (this.pass1!=this.pass2){
      console.log("Malo");
      await this.presentAlert('Error', 'Contraseñas no coinciden');
    }else{
      console.log("Bien");
      await this.presentAlert('Cambio correcto', 'Contraseña cambiada');
      this.router.navigate(["/login"])
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
