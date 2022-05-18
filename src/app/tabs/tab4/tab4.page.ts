import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss']
})
export class Tab4Page implements OnInit{

  data: any;
  likes: number;
  dislikes: number;

  constructor() {
    this.likes = 0;
    this.dislikes = 0;
  }

  ngOnInit() {
    this.getData();
  }

  async getData() {
    await fetch('../assets/data/discovery.json').then(res => res.json())
    .then(json => {
      this.data = json;
      console.log(this.data);
      console.table(this.data);
    });
  }

  handleLike() {
    this.likes++;
  }

  handleDislike() {
    this.dislikes++;
  }

  handleArrow(event) {
    console.log(event);
  }

}
