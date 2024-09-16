import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  
  // Declara las propiedades email y password (si las necesitas en el futuro)
  
  constructor(private alertController: AlertController, private router: Router) { }

  // Lista de marcas de autos
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

  // Formulario
  persona = new FormGroup({
    rut: new FormControl('', [Validators.required, Validators.pattern("[0-9]{7,8}-[0-9kK]{1}")]),
    nombre: new FormControl('', [Validators.required, Validators.pattern("[a-zA-Z]{3,15}")]),
    fecha_nacimiento: new FormControl('', [Validators.required]),                             
    correo: new FormControl('', [Validators.required, Validators.pattern("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}")]),
    password: new FormControl('', [Validators.required, Validators.minLength(4)]),
    genero: new FormControl('', [Validators.required]),
    sede: new FormControl('', [Validators.required]),
    tiene_auto: new FormControl('no', [Validators.required]),
    
    marca_auto: new FormControl(''),
    patente: new FormControl(''),
    asientos_disp: new FormControl('', []),
  });

  ngOnInit() {
    // Escuchar cambios en el campo 'tiene_auto' para actualizar las validaciones de marca_auto, patente y asientos_disp
    this.persona.get('tiene_auto')?.valueChanges.subscribe(value => {
      if (value === 'si') {
        // Si tiene auto, se añaden los validadores a los campos relacionados con el auto
        this.persona.get('marca_auto')?.setValidators([Validators.required]);
        this.persona.get('patente')?.setValidators([Validators.required]);
        this.persona.get('asientos_disp')?.setValidators([Validators.required, this.validarAsientos]);
      } else {
        // Si no tiene auto, se eliminan los validadores de los campos relacionados con el auto
        this.persona.get('marca_auto')?.clearValidators();
        this.persona.get('patente')?.clearValidators();
        this.persona.get('asientos_disp')?.clearValidators();
      }
      // Actualizamos la validez de los campos
      this.persona.get('marca_auto')?.updateValueAndValidity();
      this.persona.get('patente')?.updateValueAndValidity();
      this.persona.get('asientos_disp')?.updateValueAndValidity();
    });
  }

  validarAsientos(control: AbstractControl) {
    const valor = control.value;
    if (valor < 1 || valor > 10) {
      return { asientosInvalidos: true };
    }
    return null;
  }

  async registrar() {
    if (this.persona.valid) {
      this.router.navigate(['/login']);
      await this.presentAlert('Perfecto!', 'Registrado correctamente');
      console.log(this.persona.value);
    } else {
      await this.presentAlert('Error', 'Por favor, revisa los campos del formulario.');
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