import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  data: any = [];

  constructor() {}

  ngOnInit() {
    this.getData();
  }

  async getData() {
    await fetch('../assets/data/workshops.json').then(res => res.json())
    .then(json => {
      this.data = json.workshops;
      console.log(this.data);
      console.table(this.data);
    });
  }

}
