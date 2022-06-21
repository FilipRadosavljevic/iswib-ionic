import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AuthenticationService } from '../../services/auth/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  constructor(private auth: AuthenticationService, private router: Router,private menu: MenuController) {
  }

  ngOnInit() {}
  async logout() {
    await this.auth.logout();
    this.menu.close();
    this.router.navigate(['']);
  }
}
