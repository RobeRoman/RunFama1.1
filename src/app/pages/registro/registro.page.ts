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
  
  // Declara las propiedades email y passwor
  
  constructor(private alertController: AlertController,private router: Router) { }


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
    nombre: new FormControl('', [Validators.required, Validators.pattern("[a-zA-Z]{3,15}")]), //Bien
    fecha_nacimiento: new FormControl('', [Validators.required]),                             
    correo: new FormControl('',[Validators.required,  Validators.pattern("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}")]),
    password: new FormControl('',[Validators.required, Validators.minLength(4)]),
    genero: new FormControl('', [Validators.required]),                                       //Bien
    sede: new FormControl('', [Validators.required]),                                         //Bien
    tiene_auto: new FormControl('no', [Validators.required]),                                 //Bien
    
    //ESTO SE HARA LUEGO, PRIMERO SE TIENE QUE CORREGUIR LAS VALIDACIONES ANTERIORES
    marca_auto: new FormControl('', []),
    patente: new FormControl('', []),
    asientos_disp: new FormControl('', []),
  });



  ngOnInit() {    
  }

  validarAsientos(control: AbstractControl) {
    const valor = control.value;
    if (valor < 1 || valor > 10) {
      return { asientosInvalidos: true };
    }
    return null;
  }


  async registrar() {
    this.router.navigate(['/login']);
    await this.presentAlert('Perfecto!', 'Registrado correctamente');
    console.log(this.persona.value);
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
