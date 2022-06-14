import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  // type: string;
  type: string;
  data: any = [];
  days: any;

  constructor(private dataService: DataService) {
    this.dataService.getSchedule().subscribe(res => {
      console.log(res);
    });
  }

  ngOnInit() {
    this.type = 'day1';
    this.getData();
  }


  segmentChanged(ev: any) {
    console.log('Segment changed', ev);
  }

  async getData() {
    await fetch('../assets/data/schedule.json').then(res => res.json())
    .then(json => {
      this.data = Object.values(json);
      this.days = Object.keys(json);
      console.log(this.data);
      console.table(this.data);
    });
    console.log(this.days);
  }

}
