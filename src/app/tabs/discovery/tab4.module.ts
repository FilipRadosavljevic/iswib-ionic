import { IonicModule } from '@ionic/angular'
import { RouterModule } from '@angular/router'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'


import { Tab4PageRoutingModule } from './tab4-routing.module'


@NgModule({
    imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', loadComponent: () => import('./tab4.page').then(m => m.Tab4Page) }]),
    Tab4PageRoutingModule,
],
})
export class Tab4PageModule {}
