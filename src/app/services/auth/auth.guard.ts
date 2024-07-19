import { Injectable } from '@angular/core'
import { Auth } from '@angular/fire/auth'
import { CanActivate, Router } from '@angular/router'

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private auth: Auth,
  ) {}

  async canActivate() {
    return this.auth.currentUser ? true : this.router.createUrlTree(['/'])
  }
}
