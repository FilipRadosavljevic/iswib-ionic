import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from '../../services/data.service';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit, OnDestroy {

  type: string;
  data: any;
  days: any;
  sub: Subscription;

  constructor(private dataService: DataService) {
  }

  ngOnInit() {
    this.type = 'day0';
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  ionViewDidEnter() {
    this.getData();
  }

  segmentChanged(ev: any) {
    console.log('Segment changed', ev);
  }

  async getData() {
    this.sub = await this.dataService.getSchedule().subscribe(res => {
      this.data = Object.values(res[0]).filter(element => typeof(element) === 'object');
      this.days = Object.keys(res[0]).filter(element => element !== 'id');
    });
  }

  goToLocation(currentObject: any) {
    // eslint-disable-next-line max-len
    const googleLocation = `https://www.google.com/maps/search/?api=1&query=${currentObject.location}&query_place_id=${currentObject.placeId}`;
    window.open(googleLocation);
  }

}
