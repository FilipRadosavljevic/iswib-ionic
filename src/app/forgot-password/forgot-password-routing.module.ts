import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'



const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./forgot-password.page').then(m => m.ForgotPasswordPage),
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ForgotPasswordPageRoutingModule {}
