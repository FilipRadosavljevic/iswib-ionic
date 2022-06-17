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
  restaurants: any = [];
  data: any = [];
  sub: Subscription;
  type: string;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.type = 'restaurants';
    this.getData();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  async getData() {
    this.sub = this.dataService.getSponsors().subscribe(res => {
      this.sponsors = res;
    });
    this.dataService.getRestaurants().subscribe(res => {
      this.data = Object.values(res[0]);
      console.log(this.restaurants);

      this.restaurants = Object.keys(res[0]).filter(element => element !== 'id');
      console.log(this.data);


    });
  }

  segmentChanged(ev) {
    console.log(ev);
  }

  goToLocation(currentObject: any) {
    // eslint-disable-next-line max-len
    const googleLocation = `https://www.google.com/maps/search/?api=1&query=${currentObject.location}&query_place_id=${currentObject.placeId}`;
    window.open(googleLocation);
  }
}
