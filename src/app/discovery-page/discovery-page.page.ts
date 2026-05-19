import { Component, OnInit, inject } from '@angular/core'
import { Router } from '@angular/router'
import { IonicModule } from '@ionic/angular';

@Component({
    selector: 'app-discovery-page',
    templateUrl: './discovery-page.page.html',
    styleUrls: ['./discovery-page.page.scss'],
    imports: [IonicModule]
})
export class DiscoveryPagePage implements OnInit {
  private router = inject(Router);

  data: any

  constructor() {
    this.data = this.router.currentNavigation().extras.state
  }

  ngOnInit() {}

  goToPage() {
    this.router.navigate(['/tabs/tab4'])
  }

  goToLocation() {
    window.open(this.data.location)
  }
}
