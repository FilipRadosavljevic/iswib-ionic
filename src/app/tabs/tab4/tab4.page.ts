import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { UsersService } from 'src/app/services/users.service';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss']
})
export class Tab4Page implements OnInit, OnDestroy {

  data: any;
  sub: Subscription;
  userID: any;
  hasLiked: any;
  private subject$ = new Subject();

  constructor(
    private router: Router,
    private dataService: DataService,
    private user: UsersService
    ) {}

  ngOnInit() {
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  ionViewDidEnter() {
    this.getData();
  }

  async getData() {
    this.sub = await this.dataService.getDiscovery().subscribe(res => {
      this.data = res;
    });
  }

  // async handleLike(id) {
  //   // this.data[id-1].isLiked = !this.data[id-1].isLiked;
  //   const userid = this.user.getUserId();
  //   this.hasLiked = await this.data[id-1].likes.includes(userid);
  //   // console.log(this.hasLiked);

  //   if(!this.hasLiked) {
  //     this.data[id-1].likes.push(userid);
  //     this.dataService.updateDiscovery(this.data, id);
  //   } else {
  //     this.handleDislike(id);
  //   }
  // }

  // handleDislike(id) {
  //   // this.data[id-1].isLiked = !this.data[id-1].isLiked;
  //   this.data[id-1].likes.splice(id-1, 1);
  //   this.dataService.updateDiscovery(this.data, id);
  // }

  // async toggleHeart(id) {
  //   const userid = this.user.getUserId();
  //   this.hasLiked = await this.data[id-1].likes.includes(userid);
  //   console.log(this.hasLiked);
  //   return 'heart';
  // }

  goToPage(obj) {
    // console.log(obj);
    // this.router.navigate(['/discovery-page']);
    this.router.navigate(['/discovery-page'], {
      state: obj
    });
  }

  goToLocation(id) {
    window.open(this.data[id-1].location);
  }

}
