import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'



const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./converter.page').then(m => m.ConverterPage),
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConverterPageRoutingModule {}
