import { Component, OnDestroy, OnInit } from '@angular/core'
import { Subscription } from 'rxjs'
import { AuthenticationService } from '../services/auth/authentication.service'
import { User } from '../models/user.model'
// import { PhotoService, UserPhotoData } from '../services/photo.service';
import { LoadingController, Platform } from '@ionic/angular'
import { Product } from '../models/product.model'
import { OrderData, StoreService } from '../services/store.service'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {
  isLoading = false
  currentUser: User | undefined
  profilePictureUrl: string
  userSub: Subscription
  orders: OrderData[]
  products: OrderData[]

  constructor(
    private storeService: StoreService,
    private authService: AuthenticationService,
    // private photoService: PhotoService,
    private loadingController: LoadingController,
    private platform: Platform,
  ) {}

  ngOnInit() {
    console.log('ngOnInit')
    console.log(this.currentUser)
    this.userSub = this.authService.user.subscribe((user) => {
      console.log(user)
      this.currentUser = user
    })
  }

  async ionViewWillEnter() {
    this.isLoading = true
    //const loading = await this.loadingController.create();
    //await loading.present();

    console.log('ionViewWillEnter')
    console.log(this.currentUser)
    // const newImageData = await this.photoService.loadSaved(this.currentUser.profilePic);
    // if(this.platform.is('hybrid')){
    //   this.profilePictureUrl = newImageData.webviewPathNative;
    // } else {
    //   this.profilePictureUrl = newImageData.webviewPathWeb;
    // }
    this.orders = await this.storeService.fetchUserOrders(this.currentUser.userID)
    console.log(this.orders, 1111111)

    // this.products = await this.storeService.fetchUserOrders(this)
    this.isLoading = false
    //await loading.dismiss();
  }

  ngOnDestroy() {
    console.log('ngOnDestroy')
    if (this.userSub) {
      this.userSub.unsubscribe()
    }
  }

  // async onChooseNewProfilePic() {
  //   const newImageData = await this.photoService.addNewProfilePic();
  //   this.currentUser.profilePic = JSON.stringify(newImageData);
  //   if(this.platform.is('hybrid')){
  //     this.profilePictureUrl = newImageData.webviewPathNative;
  //   } else {
  //     this.profilePictureUrl = newImageData.webviewPathWeb;
  //   }
  // }

  async onDeleteOrder(orderID: string) {
    this.orders = this.orders.filter((order) => order.orderID !== orderID)
    await this.storeService.deleteOrder(orderID)
  }
}
