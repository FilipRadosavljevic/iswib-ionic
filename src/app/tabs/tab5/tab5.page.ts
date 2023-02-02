/* eslint-disable max-len */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-tab5',
  templateUrl: 'tab5.page.html',
  styleUrls: ['tab5.page.scss']
})
export class Tab5Page implements OnInit, OnDestroy {

  sponsors: any = [];
  restaurantData = {};
  sub: Subscription;
  type: string;

  constructor(
    private loadingCtrl: LoadingController,
    private dataService: DataService
    ) {}

  ngOnInit() {
    this.type = 'restaurants';
  }

  ngOnDestroy() {
    if(this.sub){
      this.sub.unsubscribe();
    }
  }

  async ionViewDidEnter() {
    const loadingEl = await this.loadingCtrl.create({
      message: 'Loading...',
    });
    loadingEl.present();
    await this.getData();
    loadingEl.dismiss();
  }

  async getData() {
    const sponsorsData = await this.dataService.getSponsors();
    sponsorsData.forEach(document => {
      this.sponsors.push(document.data());
    });
    const restData = await this.dataService.getRestaurants();
    restData.forEach(document => {
      this.restaurantData[document.id] = Object.values(document.data());
    });
    console.log(this.restaurantData);
  }

  segmentChanged(ev) {
    //console.log(ev);
  }

  goToLocation(currentObject: any) {
    console.log(currentObject);
    const googleLocation = `https://www.google.com/maps/search/?api=1&query=${currentObject.location}&query_place_id=${currentObject.placeId}`;
    window.open(googleLocation);
  }

  seeMore(link: string) {
    window.open(link);
  }
}
