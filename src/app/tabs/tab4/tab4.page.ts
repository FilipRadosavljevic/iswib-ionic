import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss']
})
export class Tab4Page implements OnInit {

  data: any;
  likes: number;
  // isLiked = false;

  constructor(private router: Router) {
    this.likes = 0;
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

  handleLike(id) {
    // if(!this.data[id-1].isLiked) {
      this.data[id-1].isLiked = !this.data[id-1].isLiked;
      this.data[id-1].likes++;
    // } else {
    //   this.handleDislike(id);
    // }
    console.log(id);
  }

  handleDislike(id) {
    this.data[id-1].likes--;
  }

  goToPage() {
    this.router.navigate(['/discovery-page']);
  }

}
