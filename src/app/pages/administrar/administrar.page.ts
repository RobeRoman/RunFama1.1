import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators, ValidatorFn } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ViajeService } from 'src/app/services/viaje.service';
import * as L from 'leaflet';
import * as G from 'leaflet-control-geocoder';
import 'leaflet-routing-machine';

@Component({
  selector: 'app-administrar',
  templateUrl: './administrar.page.html',
  styleUrls: ['./administrar.page.scss'],
})
export class AdministrarPage implements OnInit {
  selectedSegment: string = 'usuario'; // Segmento por defecto para alternar entre Usuario y Viaje
  usuario: any;
  private map: L.Map | undefined;
  private geocoder: G.Geocoder | undefined;
  modoEdicion: boolean = false; // Controla si está en modo de edición de viaje

  // Lista de marcas de autos para validación
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

  // Formulario de Persona (Usuario)
  persona = new FormGroup({
    rut: new FormControl('', [Validators.required, Validators.pattern("[0-9]{7,8}-[0-9kK]{1}")]),
    nombre: new FormControl('', [Validators.required, Validators.pattern("[a-zA-Z]{3,15}")]),
    fecha_nacimiento: new FormControl('', [Validators.required, this.anosvalidar(18, 100)]),
    correo: new FormControl('', [Validators.required, Validators.pattern("[a-zA-Z0-9._%+-]+@duocuc.cl")]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    genero: new FormControl('', [Validators.required]),
    sede: new FormControl('', [Validators.required]),
    tiene_auto: new FormControl('no', [Validators.required]),
    marca_auto: new FormControl(''),
    patente: new FormControl(''),
    asientos_disp: new FormControl(''),
    tipouser: new FormControl('usuario', [Validators.required]),
  });

  // Formulario de Viaje
  viaje = new FormGroup({
    id: new FormControl(),
    conductor: new FormControl('', [Validators.required]),
    asientos_disponible: new FormControl('', [Validators.required, Validators.min(1), Validators.max(16)]),
    destino: new FormControl('', [Validators.required]),
    latitud: new FormControl('', [Validators.required]),
    longitud: new FormControl('', [Validators.required]),
    distancia_m: new FormControl('', [Validators.required]),
    tiempo_minutos: new FormControl(),
    precio: new FormControl(),
    estado: new FormControl('pendiente'),
    pasajeros: new FormControl([])
  });

  usuarios: any[] = [];
  viajes: any[] = [];

  constructor(
    private alertController: AlertController,
    private usuarioService: UsuarioService,
    private viajeService: ViajeService
  ) {}

  async ngOnInit() {
    this.usuario = JSON.parse(localStorage.getItem("usuario") || '');
    this.usuarios = await this.usuarioService.getUsuarios();
    this.viajes = await this.viajeService.getViajes(); // Cargar lista de viajes al iniciar

    // Configuración de validación para campos del usuario
    this.persona.get('tiene_auto')?.valueChanges.subscribe(value => {
      if (value === 'si') {
        // Si tiene auto, se añaden los validadores a los campos relacionados con el auto
        this.persona.get('marca_auto')?.setValidators([Validators.required, this.validarMarcaAuto.bind(this)]);
        this.persona.get('patente')?.setValidators([Validators.required, Validators.pattern(/^[A-Z]{2}[0-9]{4}$|^[A-Z]{4}[0-9]{2}$/)]); // Patente de Chile
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

  // CRUD de Usuario
  async registrarUsuario() {
    if (await this.usuarioService.createUsuario(this.persona.value)) {
      await this.presentAlert('Perfecto!', 'Registrado correctamente');
      this.persona.reset();
      this.usuarios = await this.usuarioService.getUsuarios();
    } else {
      await this.presentAlert('Error!', 'El usuario no se pudo registrar');
    }
  }

  async buscar(usuario: any) {
    this.persona.patchValue(usuario);
  }

  async eliminar(rut: string) {
    if (await this.usuarioService.deleteUsuario(rut)) {
      this.usuarios = await this.usuarioService.getUsuarios();
    }
  }

  async modificarUsuario() {
    const rut_modificar = this.persona.controls.rut.value || "";
    const tieneAuto = this.persona.controls.tiene_auto.value;
  
    if (tieneAuto === 'si') {
      this.persona.get('marca_auto')?.setValidators([Validators.required, this.validarMarcaAuto.bind(this)]);
      this.persona.get('patente')?.setValidators([Validators.required, Validators.pattern(/^[A-Z]{2}[0-9]{4}$|^[A-Z]{4}[0-9]{2}$/)]);
      this.persona.get('asientos_disp')?.setValidators([Validators.required, this.validarAsientos]);
    } else {
      this.persona.get('marca_auto')?.clearValidators();
      this.persona.get('patente')?.clearValidators();
      this.persona.get('asientos_disp')?.clearValidators();
    }
  
    this.persona.get('marca_auto')?.updateValueAndValidity();
    this.persona.get('patente')?.updateValueAndValidity();
    this.persona.get('asientos_disp')?.updateValueAndValidity();
  
    if (await this.usuarioService.updateUsuario(rut_modificar, this.persona.value)) {
      this.presentAlert('Perfecto!', 'Modificado correctamente');
      this.persona.reset();
    } else {
      this.presentAlert('Error!', 'No se pudo modificar');
    }
  }

  // CRUD de Viaje
  async registrarViaje() {
    if (this.viaje.valid) {
      const nextId = await this.viajeService.getNextId();
      this.viaje.controls.id.setValue(nextId);
  
      const viaje = this.viaje.value;
      const registroV = await this.viajeService.createViaje(viaje);
  
      if (registroV) {
        await this.presentAlert('Bien', 'Viaje registrado con éxito');
        this.viajes = await this.viajeService.getViajes(); // Actualizar la lista de viajes
        this.viaje.reset();
      } else {
        await this.presentAlert('Error', 'No se pudo registrar el viaje');
      }
    } else {
      await this.presentAlert('Error', 'Formulario inválido, por favor revisa los campos.');
    }
  }

  seleccionarViaje(viaje: any) {
    this.viaje.patchValue(viaje);
    this.modoEdicion = true;
  }

  async actualizarViaje() {
    if (this.viaje.valid) {
      const id = this.viaje.controls.id.value;
      const viajeActualizado = await this.viajeService.updateViaje(id, this.viaje.value);
      if (viajeActualizado) {
        await this.presentAlert('Bien', 'Viaje actualizado con éxito');
        this.viajes = await this.viajeService.getViajes(); // Actualizar lista de viajes
        this.modoEdicion = false;
        this.viaje.reset();
      } else {
        await this.presentAlert('Error', 'No se pudo actualizar el viaje');
      }
    }
  }

  async eliminarViaje(id: string) {
    const viajeEliminado = await this.viajeService.deleteViaje(id);
    if (viajeEliminado) {
      await this.presentAlert('Bien', 'Viaje eliminado con éxito');
      this.viajes = await this.viajeService.getViajes(); // Actualizar lista de viajes
    } else {
      await this.presentAlert('Error', 'No se pudo eliminar el viaje');
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

  // Inicializar mapa para la sección de Viaje


  // Validadores personalizados
  anosvalidar(minAge: number, maxAge: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const birthDate = new Date(control.value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      return (age >= minAge && age <= maxAge) ? null : { 'invalidAge': true };
    };
  }

  validarMarcaAuto(control: AbstractControl) {
    const marca = control.value ? control.value.toLowerCase() : '';
    if (marca && !this.marcasAuto.includes(marca)) {
      return { marcaNoExiste: true };
    }
    return null;
  }
  
  validarAsientos(control: AbstractControl) {
    const valor = control.value;
    if (valor < 1 || valor > 10) {
      return { asientosInvalidos: true };
    }
    return null;
  }
}
