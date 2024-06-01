import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'

import { IonicModule } from '@ionic/angular'

import { DiscoveryPagePageRoutingModule } from './discovery-page-routing.module'

import { DiscoveryPagePage } from './discovery-page.page'

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, DiscoveryPagePageRoutingModule],
  declarations: [DiscoveryPagePage],
})
export class DiscoveryPagePageModule {}
