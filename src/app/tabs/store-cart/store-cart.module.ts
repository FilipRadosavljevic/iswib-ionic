import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'

import { IonicModule } from '@ionic/angular'

import { StoreCartPageRoutingModule } from './store-cart-routing.module'

import { StoreCartPage } from './store-cart.page'

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, StoreCartPageRoutingModule],
  declarations: [StoreCartPage],
})
export class StoreCartPageModule {}
