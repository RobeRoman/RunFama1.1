import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  // Declara las propiedades email y password
  email: string = ''; 
  password: string = '';


  alertButtons = [
    {
      text: 'Cancel',
      role: 'cancel',
      handler: () => {
        console.log('Cancel clicked');
      }
    },
    {
      text: 'OK',
      role: 'confirm',
      handler: () => {
        console.log('OK clicked');
      }
    }
  ];

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
    rut: new FormControl('', [
      Validators.minLength(9), 
      Validators.maxLength(10), 
      Validators.required, 
      Validators.pattern("[0-9]{7,8}-[0-9kK]{1}")
    ]),
    nombre: new FormControl('', [
      Validators.required, 
      Validators.pattern("[a-zA-Z]{3,15}")
    ]),
    fecha_nacimiento: new FormControl('', [Validators.required]),
    genero: new FormControl('', [Validators.required]),
    sede: new FormControl('', [Validators.required]),
    tiene_auto: new FormControl('no', [Validators.required]),
    marca_auto: new FormControl('', []),
    patente: new FormControl('', []),
    asientos_disp: new FormControl('', [this.validarAsientos.bind(this)]),
  });

  constructor(private router: Router) { }

  ngOnInit() {
    this.persona.get('marca_auto')?.setValidators(this.validarMarcaAuto.bind(this));
  }

  // Función de validación personalizada para la cantidad de asientos
  validarAsientos(control: AbstractControl) {
    const valor = control.value;
    if (valor < 1 || valor > 10) {
      return { asientosInvalidos: true };
    }
    return null;
  }

  // Función de validación para la marca de auto
  validarMarcaAuto(control: AbstractControl) {
    if (this.persona.controls.tiene_auto.value === 'si') {
      const marcaIngresada = control.value?.trim().toLowerCase(); // minúsculas y elimina espacios
      if (marcaIngresada && !this.marcasAuto.includes(marcaIngresada)) {
        return { marcaNoExiste: true }; // Error si la marca no está en la lista
      }
    }
    return null; // Sin errores si la marca existe
  }

  registrar() {
    console.log(this.persona.value);
    alert("¡Registrado con éxito!");
    this.router.navigate(['/login']);
  }

  // Función para manejar el resultado de la alerta
  setResult(ev: any) {
    console.log('Alerta cerrada con rol:', ev.detail.role);
  }
}
