import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss']
})
export class Tab4Page implements OnInit {

  data = [];
  likes: number;
  // isLiked = false;

  constructor(private router: Router, private dataService: DataService) {
    this.dataService.getDiscovery().subscribe(res => {
      this.data = res;
      // console.log(this.data[0].image);
    });
  }

  ngOnInit() {
    // this.getData();

  }

  // async getData() {
  //   await fetch('../assets/data/discovery.json').then(res => res.json())
  //   .then(json => {
  //     this.data = json;
  //     console.log(this.data);
  //     console.table(this.data);
  //   });
  // }

  handleLike(id) {
    this.data[id-1].isLiked = !this.data[id-1].isLiked;
    this.data[id-1].likes++;
    console.log(this.data);
    this.dataService.updateDiscovery(this.data, id);
    // if(!this.data[id-1].isLiked) {
    // } else {
    //   this.handleDislike(id);
    // }
    console.log(id);
  }

  handleDislike(id) {
    this.data[id-1].isLiked = !this.data[id-1].isLiked;
    this.data[id-1].likes--;
    console.log(this.data);
    this.dataService.updateDiscovery(this.data, id);
  }

  goToPage() {
    this.router.navigate(['/discovery-page']);
  }

  goToLocation(id) {
    window.open(this.data[id-1].location);
  }

}
