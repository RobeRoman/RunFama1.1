import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  usuario: any = {
    nombre: '',
    correo: '',
    rut: '',
    foto_perfil: '',
    fecha_nacimiento: '',
  };
  modoEdicion: boolean = false;

  constructor(private usuarioService: UsuarioService, private alertController: AlertController) {}

  ngOnInit() {    
    this.cargarDatosUsuario();
  }

  cargarDatosUsuario() {
    this.usuario = JSON.parse(localStorage.getItem("usuario") || '{}');
  }

  habilitarEdicion() {
    this.modoEdicion = true;
  }

  cancelarEdicion() {
    this.modoEdicion = false;
    //this.cargarUsuario(); // Restaura los valores originales
  }

  cargarFotoPerfil(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.usuario.foto_perfil = reader.result as string; // Guarda la imagen en Base64
      };
      reader.readAsDataURL(file); 
    }
  }

  async guardarCambios() {
    const edad = this.calcularEdad(this.usuario.fecha_nacimiento);
    if (edad < 18) {
      this.presentAlert('Error', 'La edad debe ser mayor o igual a 18 años.');
      return; 
    }

    const exito = await this.usuarioService.updateUsuario(this.usuario.rut, this.usuario);
    if (exito) {
      this.usuarioService.setUsuarioAutenticado(this.usuario);
      localStorage.setItem("usuario", JSON.stringify(this.usuario));
      
      this.modoEdicion = false;
      this.presentAlert('Éxito', 'Los cambios se han guardado correctamente.');
    } else {
      this.presentAlert('Error', 'No se pudieron guardar los cambios.');
    }
  }

  calcularEdad(fecha: string): number {
    const [day, month, year] = fecha.split('/');
    const fechaNacimiento = new Date(`${year}-${month}-${day}`);
    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const mes = hoy.getMonth() - fechaNacimiento.getMonth();
    console.log(this.calcularEdad);
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
      edad--;
    }
    return edad;
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
