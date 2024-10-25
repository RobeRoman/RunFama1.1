import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetallesReservasPage } from './detalles-reservas.page';

describe('DetallesReservasPage', () => {
  let component: DetallesReservasPage;
  let fixture: ComponentFixture<DetallesReservasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetallesReservasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
