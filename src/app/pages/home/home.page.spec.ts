import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HomePage } from './home.page';

import { RouterTestingModule } from '@angular/router/testing';
import { IonicStorageModule } from '@ionic/storage-angular';
import { HttpClientModule } from '@angular/common/http';
import { FireService } from 'src/app/services/fire.service';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from 'src/environments/environment';

describe('Pagina de Home', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let usuarioTest = {
    "rut": "16211900-2",
    "nombre": "Carlos",
    "fecha_nacimiento": "2003-09-02",
    "correo": "carlos@duocuc.cl",
    "password": "12345678",
    "repetir_password": "12345678",
    "genero": 'masculino',
    "sede": "Puente Alto",
    "tiene_auto": "no",
    "marca_autor": '',
    "patente": '',
    "asientos_disp": ''
  };

  beforeEach(async () => {

    const localStorageP = {
      getItem: jasmine.createSpy('getItem').and.callFake((key: string) => {
        if (key === 'usuario'){
          return JSON.stringify(usuarioTest);
        }
        return null;
      }),
      setItem: jasmine.createSpy('setItem'),
      removeItem: jasmine.createSpy('removeItem')
    }
    Object.defineProperty(window,'localStorage',{value: localStorageP});
    
    await TestBed.configureTestingModule({
      declarations: [HomePage],
      imports: [IonicModule.forRoot(), RouterTestingModule, IonicStorageModule.forRoot(), HttpClientModule, AngularFireModule.initializeApp(environment.firebaseConfig)]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('1. Verificar si la página se abre', () => {
    expect(component).toBeTruthy();
  });

  it ('2. Verificar nombre', () =>{
    expect(component.usuario.nombre).toEqual('Carlos');
  });

  it ('3. Verificar genero sea masculino', () =>{
    expect(component.usuario.genero).toEqual('masculino');
  });

  it ('4. Verificar que no tenga auto', () =>{
    expect(component.usuario.tiene_auto).toEqual('no');
  });

  it('5. Verificar si la fecha de nacimiento es 2003-09-02', () => {
    expect(component.usuario.fecha_nacimiento).toEqual('2003-09-02');
  });

  it('6. Verificar correo', () => {
    expect(component.usuario.correo).toEqual('carlos@duocuc.cl');
  });

  it('7. Verificar que el RUT es 16211900-2', () => {
    expect(component.usuario.rut).toEqual('16211900-2');
  });

  it('8. Verificar que la sede es Puente Alto', () => {
    expect(component.usuario.sede).toEqual('Puente Alto');
  });

  it('9. Verificar que la propiedad "marca_autor" está vacía', () => {
    expect(component.usuario.marca_autor).toEqual('');
  });

  it('10. Verificar que la propiedad "patente" está vacía', () => {
    expect(component.usuario.patente).toEqual('');
  });

  it('11. Verificar que la propiedad "asientos_disp" está vacía', () => {
    expect(component.usuario.asientos_disp).toEqual('');
  });

  it('12. Verificar que el componente se inicializa correctamente', () => {
    expect(component).toBeDefined();
  });

  it('13. Verificar que el servicio de FireService se inicializa correctamente', () => {
    const fireService = TestBed.inject(FireService);
    expect(fireService).toBeTruthy();
  });

  it('14. Verificar que el módulo AngularFirestore se haya importado correctamente', () => {
    const firestore = TestBed.inject(AngularFirestore);
    expect(firestore).toBeTruthy();
  });

  it('15. Verificar que el componente tiene la propiedad "usuario"', () => {
    expect(component.usuario).toBeDefined();
  });

  // Nuevas pruebas

  it('16. Verificar que el nombre de usuario no esté vacío', () => {
    expect(component.usuario.nombre).not.toBeNull();
    expect(component.usuario.nombre).not.toBe('');
  });

  it('17. Verificar si el componente tiene una propiedad "usuario" de tipo objeto', () => {
    expect(component.usuario).toBeDefined();
    expect(typeof component.usuario).toBe('object');
  });

  it('18. Verificar que la propiedad "tiene_auto" sea de tipo string', () => {
    expect(typeof component.usuario.tiene_auto).toBe('string');
  });

  it('19. Verificar si el correo contiene un "@"', () => {
    expect(component.usuario.correo).toContain('@');
  });

  it ('20. Verificar que el correo sea @duocuc.cl', ()=>{
    expect(component.usuario.correo).toContain('@duocuc.cl')
  });

});
