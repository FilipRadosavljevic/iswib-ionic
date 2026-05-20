import { Component, OnDestroy, OnInit, inject } from '@angular/core'
import { Subject } from 'rxjs'
import { AuthService } from '../services/auth/auth.service'
import { User } from '../models/user.model'
// import { PhotoService, UserPhotoData } from '../services/photo.service';
import { LoadingController, Platform, IonicModule } from '@ionic/angular'
import { OrderData, StoreService } from '../services/store.service'
import { takeUntil } from 'rxjs/operators'
import { HeaderComponent } from '../components/header/header.component'
import { CurrencyPipe, DatePipe } from '@angular/common'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  imports: [HeaderComponent, IonicModule, CurrencyPipe, DatePipe],
})
export class ProfilePage implements OnInit, OnDestroy {
  private storeService = inject(StoreService)
  private authService = inject(AuthService)
  private loadingController = inject(LoadingController)
  private platform = inject(Platform)

  private ngUnsubscribe = new Subject<void>()

  isLoading = false
  currentUser: User | undefined
  profilePictureUrl: string
  orders: OrderData[]
  products: OrderData[]

  ngOnInit() {
    this.authService.user.pipe(takeUntil(this.ngUnsubscribe)).subscribe((user) => {
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
    // this.orders = await this.storeService.fetchUserOrders(this.currentUser.userID)
    // console.log(this.orders, 1111111)

    // this.products = await this.storeService.fetchUserOrders(this)
    this.isLoading = false
    //await loading.dismiss();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next()
    this.ngUnsubscribe.complete()
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
