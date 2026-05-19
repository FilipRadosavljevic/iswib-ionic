import { IonicModule } from '@ionic/angular'
import { RouterModule } from '@angular/router'
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'


import { Tab5PageRoutingModule } from './tab5-routing.module'


@NgModule({
    imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', loadComponent: () => import('./tab5.page').then(m => m.Tab5Page) }]),
    Tab5PageRoutingModule,
],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Tab5PageModule {}
