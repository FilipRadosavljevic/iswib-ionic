import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {
  redirectLoggedInTo,
  canActivate,
} from '@angular/fire/auth-guard';
import { AuthGuard } from './services/auth/auth.guard';

//const redirectLoggedInToHome = () => redirectLoggedInTo(['tabs']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['profile']);

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule),
    ...canActivate(redirectLoggedInToHome)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'discovery-page',
    loadChildren: () => import('./discovery-page/discovery-page.module').then( m => m.DiscoveryPagePageModule)
  },
  {
    path: 'registration',
    loadChildren: () => import('./registration/registration.module').then( m => m.RegistrationPageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'converter',
    loadChildren: () => import('./converter/converter.module').then( m => m.ConverterPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'huddle',
    loadChildren: () => import('./huddle/huddle.module').then( m => m.HuddlePageModule),
    canActivate: [AuthGuard],
  },

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
