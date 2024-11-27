import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HomePage } from './home.page';

import { RouterTestingModule } from '@angular/router/testing';

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
  }

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
      imports: [IonicModule.forRoot(), RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('1. Ver si abre la pagina', () => {
    expect(component).toBeTruthy();
  });
});
