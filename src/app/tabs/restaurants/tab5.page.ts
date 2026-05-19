import { Component, OnInit, OnDestroy, inject } from '@angular/core'
import { Subscription } from 'rxjs'
import { IonicSlides, IonicModule } from '@ionic/angular'
import { DataService } from 'src/app/services/data.service'
import { HeaderComponent } from '../../components/header/header.component'
import { NgClass } from '@angular/common'
import { FormsModule } from '@angular/forms'

@Component({
  selector: 'app-restaurants',
  templateUrl: 'tab5.page.html',
  styleUrls: ['tab5.page.scss'],
  imports: [HeaderComponent, IonicModule, FormsModule, NgClass],
})
export class Tab5Page implements OnInit, OnDestroy {
  private dataService = inject(DataService)

  swiperModules = [IonicSlides]
  sponsors: any = []
  restaurants: any = []
  data: any
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
      this.sponsors = res
    })
    this.dataService.getRestaurants().subscribe((res) => {
      this.data = Object.values(res[0])
      console.log(this.restaurants)

      this.restaurants = Object.keys(res[0]).filter((element) => element !== 'id')
      console.log(this.data)
    })
  }

  segmentChanged(ev) {
    console.log(ev)
  }

  goToLocation(currentObject: any) {
    // eslint-disable-next-line max-len
    const googleLocation = `https://www.google.com/maps/search/?api=1&query=${currentObject.location}&query_place_id=${currentObject.placeId}`
    window.open(googleLocation)
  }

  seeMore(link: string) {
    window.open(link)
  }
}
