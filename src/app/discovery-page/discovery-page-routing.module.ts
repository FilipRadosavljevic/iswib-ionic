import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'



const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./discovery-page.page').then(m => m.DiscoveryPagePage),
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DiscoveryPagePageRoutingModule {}
