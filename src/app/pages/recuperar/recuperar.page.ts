import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UsuarioService } from '../../services/usuario.service';

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
    private usuarioService: UsuarioService // Inyectar UsuarioService
  ) { }

  ngOnInit() { }

  async validarcorreo() {
    if (this.email === '') {
      await this.presentAlert('Error', 'Correo vacío');
    } else if (this.usuarioService.getUsuarios().some(user => user.correo === this.email)) {
      await this.presentAlert('Bien', 'Ingrese código de verificación y cambie contraseñas');
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
