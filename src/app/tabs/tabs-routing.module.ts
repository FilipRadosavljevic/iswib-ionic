import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'


const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./tabs.page').then(m => m.TabsPage),
    children: [
      {
        path: 'schedule',
        loadChildren: () => import('./schedule/tab1.module').then((m) => m.Tab1PageModule),
      },
      {
        path: 'workshops',
        loadChildren: () => import('./workshops/tab2.module').then((m) => m.Tab2PageModule),
      },
      {
        path: 'shop',
        loadChildren: () => import('./shop/tab3.module').then((m) => m.Tab3PageModule),
      },
      {
        path: 'discovery',
        loadChildren: () => import('./discovery/tab4.module').then((m) => m.Tab4PageModule),
      },
      {
        path: 'restaurants',
        loadChildren: () => import('./restaurants/tab5.module').then((m) => m.Tab5PageModule),
      },
      {
        path: '',
        redirectTo: '/tabs/schedule',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/schedule',
    pathMatch: 'full',
  },
  {
    path: 'store-cart',
    loadChildren: () => import('./store-cart/store-cart.module').then((m) => m.StoreCartPageModule),
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
