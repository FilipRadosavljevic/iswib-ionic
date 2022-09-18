import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private authService: AuthenticationService,
    private router: Router,
    ) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    console.log('Entered AuthGuard');
    await this.authService.autoLogin();
    return true;
  }
  async canLoad(route: Route, segments: UrlSegment[]) {
    console.log('Entered AuthGuard');
    await this.authService.autoLogin();
    return true;
  }
}
