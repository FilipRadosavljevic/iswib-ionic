import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss']
})
export class Tab4Page implements OnInit, OnDestroy {

  data: any = [];
  sub: Subscription;
  userID: any;
  hasLiked: any;

  constructor(
    private loadingCtrl: LoadingController,
    private router: Router,
    private dataService: DataService
    ) {}

  ngOnInit() {
  }

  ngOnDestroy() {
    if(this.sub){
      this.sub.unsubscribe();
    }
  }

  async ionViewDidEnter() {
    const loadingEl = await this.loadingCtrl.create({
      message: 'Loading...',
    });
    loadingEl.present();
    await this.getData();
    loadingEl.dismiss();
  }

  async getData() {
    const discoveryData = await this.dataService.getDiscovery();
    discoveryData.forEach(document => {
      this.data.push(document.data());
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
    this.router.navigate(['/discovery-page'], {
      state: obj
    });
  }

  goToLocation(currentObject: any) {
    // eslint-disable-next-line max-len
    const googleLocation = `https://www.google.com/maps/search/?api=1&query=${currentObject.location}&query_place_id=${currentObject.placeId}`;
    window.open(googleLocation);
  }

}
