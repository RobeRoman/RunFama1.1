import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { FireService } from 'src/app/services/fire.service';

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
    private fireService: FireService,
    private auth: AngularFireAuth
  ) { }

  async ngOnInit() {
    // Inicializar el storage
  }

  sendLinkReset(){
    this.fireService.recuperar(this.email).then(()=>{
      console.log('Enviando');
    }).catch(()=>{
      console.log('Error');
    })
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
