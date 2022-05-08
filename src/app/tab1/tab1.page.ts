import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  type: string;
  data: any;

  constructor() {}
  // constructor(public http: HttpClient) {}

  ngOnInit() {
    this.type = 'day1';
    this.getData();
  }

  segmentChanged(ev: any) {
    console.log('Segment changed', ev);
  }

  getData() {
    fetch('../assets/data/schedule.json').then(res => res.json())
    .then(json => {
      this.data = json;
      console.table(this.data);
    });
  }
}
