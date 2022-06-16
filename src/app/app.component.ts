import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './services/auth/authentication.service';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private auth: AuthenticationService, private router: Router,private menu: MenuController) {
  }

  async logout() {
    await this.auth.logout();
    this.menu.close();
    this.router.navigate(['']);
  }
}
