import { Component, OnInit } from '@angular/core';
import { AbstractControl,FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { UsuarioService } from 'src/app/services/usuario.service';


@Component({
  selector: 'app-administrar',
  templateUrl: './administrar.page.html',
  styleUrls: ['./administrar.page.scss'],
})
export class AdministrarPage implements OnInit {
  persona = new FormGroup({
    rut: new FormControl('', [Validators.required, Validators.pattern("[0-9]{7,8}-[0-9kK]{1}")]),
    nombre: new FormControl('', [Validators.required, Validators.pattern("[a-zA-Z]{3,15}")]),
    fecha_nacimiento: new FormControl('', [Validators.required]),
    correo: new FormControl('', [Validators.required, Validators.pattern("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}")]),
    password: new FormControl('', [Validators.required, Validators.minLength(4)]),
    genero: new FormControl('', [Validators.required]),
    sede: new FormControl('', [Validators.required]),
    tiene_auto: new FormControl('no', [Validators.required]),
    marca_auto: new FormControl('', [this.validarMarcaAuto.bind(this)]),
    patente: new FormControl('', [Validators.pattern(/^[A-Z]{2}[0-9]{4}$|^[A-Z]{4}[0-9]{2}$/)]),
    asientos_disp: new FormControl('', []),
  });

  usuarios: any[] = [];

  constructor(private alertController: AlertController, private usuarioService: UsuarioService) { }

  marcasAuto: string[] = [
    'abarth', 'acura', 'alfa romeo', 'audi', 'bmw', 'bentley', 'buick', 'cadillac', 
    'chevrolet', 'citroën', 'dodge', 'fiat', 'ford', 'genesis', 'honda', 'hyundai', 
    'infiniti', 'jaguar', 'jeep', 'kia', 'lamborghini', 'land rover', 'lexus', 
    'lincoln', 'maserati', 'mazda', 'mclaren', 'mercedes benz', 'mini', 'mitsubishi', 
    'nissan', 'pagani', 'peugeot', 'porsche', 'ram', 'renault', 'rolls royce', 
    'saab', 'seat', 'skoda', 'smart', 'subaru', 'suzuki', 'tesla', 'toyota', 
    'volkswagen', 'volvo', 'byd', 'jac', 'changan', 'great wall', 'geely', 
    'haval', 'mg', 'brilliance', 'foton', 'lynk & co', 'dongfeng', 'xpeng', 
    'nio', 'ora', 'rivian', 'polestar', 'karma', 'landwind', 'zotye', 
    'wuling', 'baojun', 'gac', 'hummer'
  ];

  ngOnInit() {
    this.usuarios = this.usuarioService.getUsuarios();
  }

  async registrar() {
    if (this.usuarioService.createUsuario(this.persona.value)) {
      await this.presentAlert('Perfecto!', 'Registrado correctamente');
      this.persona.reset();
      this.usuarios = this.usuarioService.getUsuarios(); 
    } else {
      await this.presentAlert('Error!', 'El usuario no se pudo registrar');
    }
  }

  buscar(usuario: any) {
    this.persona.patchValue(usuario); 
  }

  eliminar(rut: string) {
    if (this.usuarioService.deleteUsuario(rut)) {
      this.usuarios = this.usuarioService.getUsuarios(); 
    }
  }

  validarMarcaAuto(control: AbstractControl) {
    const marca = control.value ? control.value.toLowerCase() : '';
    if (marca && !this.marcasAuto.includes(marca)) {
      return { marcaNoExiste: true };
    }
    return null;
  }
  async modificar() {
    var rut_modificar = this.persona.controls.rut.value || "";
    if (this.usuarioService.updateUsuario(rut_modificar, this.persona.value)){
      await this.presentAlert('Perfecto!', 'Modificado correctamente');
    }else{
      await this.presentAlert('Error!', 'No se pudo modificar');
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