import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, OnDestroy, inject } from '@angular/core'
import { Subscription } from 'rxjs'
import { IonicSlides, IonicModule } from '@ionic/angular'
import { DataService } from 'src/app/services/data.service'
import { HeaderComponent } from '../../components/header/header.component'
import { NgClass } from '@angular/common'
import { FormsModule } from '@angular/forms'

interface Sponsor {
  name: string
  image: string
  link?: string
}

interface RestaurantItem {
  name: string
  image: string
  timeFrom: string
  timeTo: string
  location: string
  placeId: string
  vegan?: boolean
}

@Component({
  selector: 'app-restaurants',
  templateUrl: 'tab5.page.html',
  styleUrls: ['tab5.page.scss'],
  imports: [HeaderComponent, IonicModule, FormsModule, NgClass],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Tab5Page implements OnInit, OnDestroy {
  private dataService = inject(DataService)

  swiperModules = [IonicSlides]
  sponsors: Sponsor[] = []
  restaurants: string[] = []
  data: RestaurantItem[][] = []
  sub: Subscription
  type: string

  ngOnInit() {
    this.type = 'restaurants'
  }

  ngOnDestroy() {
    this.sub.unsubscribe()
  }

  ionViewDidEnter() {
    this.getData()
  }

  async getData() {
    this.sub = this.dataService.getSponsors().subscribe((res) => {
      this.sponsors = res as Sponsor[]
    })
    this.dataService.getRestaurants().subscribe((res) => {
      this.data = Object.values(res[0]) as RestaurantItem[][]
      this.restaurants = Object.keys(res[0]).filter((element) => element !== 'id')
    })
  }

  segmentChanged(ev: Event) {
    console.log(ev)
  }

  goToLocation(currentObject: RestaurantItem) {
    const googleLocation = `https://www.google.com/maps/search/?api=1&query=${currentObject.location}&query_place_id=${currentObject.placeId}`
    window.open(googleLocation)
  }
}
