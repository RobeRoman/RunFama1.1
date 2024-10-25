import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetallesReservasPageRoutingModule } from './detalles-reservas-routing.module';

import { DetallesReservasPage } from './detalles-reservas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetallesReservasPageRoutingModule
  ],
  declarations: [DetallesReservasPage]
})
export class DetallesReservasPageModule {}
