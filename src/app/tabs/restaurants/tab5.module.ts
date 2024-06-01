import { IonicModule } from '@ionic/angular'
import { RouterModule } from '@angular/router'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { Tab5Page } from './tab5.page'

import { Tab5PageRoutingModule } from './tab5-routing.module'
import { HeaderModule } from 'src/app/components/header/header.component.module'

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: Tab5Page }]),
    Tab5PageRoutingModule,
    HeaderModule,
  ],
  declarations: [Tab5Page],
})
export class Tab5PageModule {}