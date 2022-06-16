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
  sub: Subscription;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.getData();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  async getData() {
    this.sub = this.dataService.getSponsors().subscribe(res => {
      this.sponsors = res;
      console.log(res);
    });
    this.dataService.getRestaurants().subscribe(res => {
      this.restaurants = res;
      console.log(res);
    });
  }

  segmentChanged(ev) {
    console.log(ev);
  }

  goToLocation() {
    console.log('location');
  }
}
