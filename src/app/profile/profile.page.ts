import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../services/auth/authentication.service';
import { User } from '../models/user.model';
import { PhotoService, UserPhotoData } from '../services/photo.service';
import { LoadingController, Platform } from '@ionic/angular';
import { Product } from '../models/product.model';
import { OrderData, StoreService } from '../services/store.service';
import { DataService } from '../services/data.service';
import { Huddle } from '../models/huddle.model';
import { HuddleService } from '../services/huddle.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {
  isLoading = false;
  currentUser: User | undefined;
  profilePictureUrl: string;
  userSub: Subscription;
  orderSub: Subscription;
  huddleSub: Subscription;
  orders: OrderData[];
  products: OrderData[];
  huddles: Huddle[];

  constructor(
    private huddleService: HuddleService,
    private storeService: StoreService,
    private dataService: DataService,
    private authService: AuthenticationService,
    private photoService: PhotoService,
    private loadingCtrl: LoadingController,
    private platform: Platform
  ) {}

  ngOnInit() {
    this.userSub = this.authService.user
    .subscribe(user => {
        console.log(user);
        this.currentUser = user;
      });

    this.huddleSub = this.huddleService.huddles
    .subscribe(huddles => {
      this.huddles = huddles;
      //this.huddles = huddles.filter(h => h.creatorID === this.currentUser.userID);
    });
  }

  async ionViewWillEnter() {
    /*const loadingEl = await this.loadingCtrl.create({
      message: 'Loading...',
    });
    loadingEl.present();*/

    const newImageData = await this.photoService.loadSaved(this.currentUser.profilePic);
    if(this.platform.is('hybrid')){
      this.profilePictureUrl = newImageData.webviewPathNative;
    } else {
      console.log('desktop');
      this.profilePictureUrl = newImageData.webviewPathWeb;
      console.log(this.profilePictureUrl);
    }
    //await this.huddleService.fetchHuddlesByUserID(this.currentUser.userID);
    this.orders = await this.storeService.fetchUserOrders(this.currentUser.userID);
    //loadingEl.dismiss();
  }

  ngOnDestroy() {
    console.log('ngOnDestroy');
    if(this.userSub){
      this.userSub.unsubscribe();
    }
    if(this.huddleSub){
      this.huddleSub.unsubscribe();
    }
  }

  async onChooseNewProfilePic() {
    const newImageData = await this.photoService.addNewProfilePic();
    console.log(newImageData);
    this.currentUser.profilePic = JSON.stringify(newImageData);
    if(this.platform.is('hybrid')){
      this.profilePictureUrl = newImageData.webviewPathNative;
    } else {
      this.profilePictureUrl = newImageData.webviewPathWeb;
    }
  }

  async onDeleteOrder(orderID: string) {
    this.orders = this.orders.filter(order => order.orderID !== orderID);
    await this.storeService.deleteOrder(orderID);
  }
}
