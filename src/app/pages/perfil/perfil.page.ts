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
    this.cargarUsuario();
  }

  cargarUsuario() {
    const usuarioAutenticado = this.usuarioService.getUsuarioAutenticado();
    if (usuarioAutenticado) {
      this.usuario = { ...usuarioAutenticado }; 
      this.usuario.fecha_nacimiento = this.formatearFecha(this.usuario.fecha_nacimiento); // Formatear fecha
    }
  }

  habilitarEdicion() {
    this.modoEdicion = true;
  }

  cancelarEdicion() {
    this.modoEdicion = false;
    this.cargarUsuario(); // Restaura los valores originales
  }

  formatearFecha(fecha: string): string {
    const [year, month, day] = fecha.split('-');
    return `${day}/${month}/${year}`;
  }

  calcularEdad(fecha: string): number {
    const [day, month, year] = fecha.split('/');
    const fechaNacimiento = new Date(`${year}-${month}-${day}`);
    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const mes = hoy.getMonth() - fechaNacimiento.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
      edad--;
    }

    return edad;
  }

  async guardarCambios() {
    // Convertir fecha a formato ISO antes de guardar
    this.usuario.fecha_nacimiento = this.formatoISO(this.usuario.fecha_nacimiento);

    const edad = this.calcularEdad(this.usuario.fecha_nacimiento);
    if (edad < 18) {
      this.presentAlert('Error', 'La edad debe ser mayor o igual a 18 años.');
      return; // Detiene el proceso de guardado
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

  formatoISO(fecha: string): string {
    const [day, month, year] = fecha.split('/');
    return `${year}-${month}-${day}`;
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
