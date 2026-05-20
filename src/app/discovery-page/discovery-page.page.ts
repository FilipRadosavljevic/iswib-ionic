import { Component, inject } from '@angular/core'
import { Router } from '@angular/router'
import { IonicModule } from '@ionic/angular'

interface DiscoveryItem {
  name: string
  image: string
  description?: string
  location?: string
  placeId?: string
}

@Component({
  selector: 'app-discovery-page',
  templateUrl: './discovery-page.page.html',
  styleUrls: ['./discovery-page.page.scss'],
  imports: [IonicModule],
})
export class DiscoveryPagePage {
  private router = inject(Router)

  data: DiscoveryItem

  constructor() {
    this.data = this.router.currentNavigation().extras.state as DiscoveryItem
  }

  goToPage() {
    this.router.navigate(['/tabs/tab4'])
  }

  goToLocation() {
    window.open(this.data.location)
  }
}
