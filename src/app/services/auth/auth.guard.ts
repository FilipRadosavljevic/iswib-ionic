import { Injectable, inject } from '@angular/core'
import { Auth } from '@angular/fire/auth'
import { Router } from '@angular/router'

@Injectable({
  providedIn: 'root',
})
export class AuthGuard  {
  private router = inject(Router)
  private auth = inject(Auth)


  async canActivate() {
    return this.auth.currentUser ? true : this.router.createUrlTree(['/'])
  }
}
