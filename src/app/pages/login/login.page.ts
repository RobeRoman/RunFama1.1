import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email:String ="";
  password:String ="";

  constructor(private alertController: AlertController,private router: Router) { }

  ngOnInit() {
  }
  

  async login(){
    if(this.email=="admin@gmail.com" && this.password=="123"){
      this.router.navigate(['/home'])
    }else{
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
