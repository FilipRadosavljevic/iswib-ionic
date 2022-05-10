import { Component, OnInit } from '@angular/core';
// import { GoogleMap } from '@capacitor/google-maps';
// import { environment } from '../../environments/environment';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  // @ViewChild('map')
  // mapRef: ElementRef<HTMLElement>;
  // newMap: GoogleMap;


  type: string;
  data: any = [];


  constructor() {}

  ngOnInit() {
    this.type = 'day1';
    this.getData();
  }

  // ionViewDidEnter() {
  //   this.createMap();
  // }

  // async createMap() {
  //   this.newMap = await GoogleMap.create({
  //     id: 'my-cool-map',
  //     element: this.mapRef.nativeElement,
  //     apiKey: environment.apiKey,
  //     config: {
  //       center: {
  //         lat: 33.6,
  //         lng: -117.9,
  //       },
  //       zoom: 8,
  //     },
  //   });
  // }

  segmentChanged(ev: any) {
    console.log('Segment changed', ev);
  }

  async getData() {
    await fetch('../assets/data/schedule.json').then(res => res.json())
    .then(json => {
      this.data = json;
      console.log(this.data);
      console.table(this.data);
    });
  }
}
