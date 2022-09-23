/* eslint-disable max-len */
import { Component, OnInit, OnDestroy } from '@angular/core';
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

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.type = 'restaurants';
  }

  ngOnDestroy() {
    if(this.sub){
      this.sub.unsubscribe();
    }
  }

  async ionViewDidEnter() {
    await this.getData();
  }

  async getData() {
    this.sub = await this.dataService.getSponsors().subscribe(res => {
      this.sponsors = res;
    });
    const data = await this.dataService.getRestaurants();
    data.forEach(document => {
      this.restaurantData[document.id] = Object.values(document.data());
    });
    console.log(this.restaurantData);
      /*this.data = Object.values(res[0]);
      console.log(this.restaurants);

      this.restaurants = Object.keys(res[0]).filter(element => element !== 'id');
      console.log(this.data);*/

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
