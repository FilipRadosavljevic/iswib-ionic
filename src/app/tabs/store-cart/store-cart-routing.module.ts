import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StoreCartPage } from './store-cart.page';

const routes: Routes = [
  {
    path: '',
    component: StoreCartPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StoreCartPageRoutingModule {}
