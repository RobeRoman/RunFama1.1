import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetallesReservasPage } from './detalles-reservas.page';

const routes: Routes = [
  {
    path: '',
    component: DetallesReservasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetallesReservasPageRoutingModule {}
