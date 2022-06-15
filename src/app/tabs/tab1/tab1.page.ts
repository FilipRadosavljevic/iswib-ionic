import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { get, getDatabase, onValue, ref } from 'firebase/database';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  type: string;
  data: any = [];
  days: any;

  constructor(private dataService: DataService) {
  }

  ngOnInit() {
    this.type = 'day1';
    this.getData();
  }


  segmentChanged(ev: any) {
    console.log('Segment changed', ev);
  }


  async getData() {
    this.dataService.getSchedule().subscribe(res => {
      this.data = Object.values(res[0]).filter(element => typeof(element) === 'object');
      this.days = Object.keys(res[0]).filter(element => element !== 'id');
    });
  }

}
