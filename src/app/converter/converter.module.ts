import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'

import { IonicModule } from '@ionic/angular'

import { ConverterPageRoutingModule } from './converter-routing.module'

import { ConverterPage } from './converter.page'
import { HeaderModule } from '../components/header/header.component.module'

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ConverterPageRoutingModule, HeaderModule],
  declarations: [ConverterPage],
})
export class ConverterPageModule {}
