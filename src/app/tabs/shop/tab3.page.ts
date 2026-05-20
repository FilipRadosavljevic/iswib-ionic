import { Component, OnDestroy, OnInit, inject } from '@angular/core'
import { Router } from '@angular/router'
import {
  AlertController,
  IonRouterOutlet,
  ModalController,
  ToastController,
  IonicModule,
} from '@ionic/angular'
import { Product } from 'src/app/models/product.model'
import { AuthService } from 'src/app/services/auth/auth.service'
import { StoreService } from 'src/app/services/store.service'
import { StoreCartPage } from '../store-cart/store-cart.page'
import { Subject } from 'rxjs'
import { User } from '../../models/user.model'
import { takeUntil } from 'rxjs/operators'
import { HeaderComponent } from '../../components/header/header.component'
import { CurrencyPipe } from '@angular/common'

@Component({
  selector: 'app-shop',
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
  imports: [HeaderComponent, IonicModule, CurrencyPipe],
})
export class Tab3Page implements OnInit, OnDestroy {
  authService = inject(AuthService)
  private storeService = inject(StoreService)
  private alertController = inject(AlertController)
  toastController = inject(ToastController)
  modalController = inject(ModalController)
  private routerOutlet = inject(IonRouterOutlet)
  private router = inject(Router)

  private _unsubscribe$ = new Subject<void>()

  cart: Product[] = []
  products: Product[] = []
  user: User | null

  async ngOnInit() {
    this.authService.user.pipe(takeUntil(this._unsubscribe$)).subscribe((user) => {
      this.user = user
    })

    this.storeService.products.pipe(takeUntil(this._unsubscribe$)).subscribe((products) => {
      this.products = products
    })
  }

  ngOnDestroy() {
    this._unsubscribe$.next()
    this._unsubscribe$.complete()
  }

  ionViewWillEnter() {
    this.storeService.getProducts().subscribe()
  }

  async redirectLogin(header: string) {
    const alert = await this.alertController.create({
      header,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Log In',
          role: 'confirm',
          handler: () => {
            this.router.navigateByUrl('/', { replaceUrl: true })
          },
        },
      ],
    })
    await alert.present()
  }

  public calculateCartQuantity(): number {
    return this.cart.reduce((accumulator, product) => accumulator + product.totalPrice, 0)
  }

  async openCartModal() {
    console.log(this.cart)
    console.log(this.products)
    if (this.cart.length > 0) {
      const modal = await this.modalController.create({
        component: StoreCartPage,
        presentingElement: this.routerOutlet.nativeEl,
        componentProps: {
          productsInCart: this.cart,
        },
      })
      modal.present()
      const orderData = (await modal.onDidDismiss()).data as Product[]
      if (orderData) {
        console.log(orderData)
        this.cart.length = 0
        this.storeService.placeOrder(orderData)
        this.presentToast(`Thanks for your order!`)
      }
    }
  }

  async addToCart(product: Product) {
    // const foundProduct = this.cart.find((p) => p.name === product.name)
    // if (foundProduct) {
    //   foundProduct.sizes[product.].quantity += 1
    // } else {
    //   product.quantity = 1
    //   this.cart.push(product)
    // }
    // this.storeService.placeCart(this.cart)

    await this.presentToast(`${product.name} added`)
  }

  private async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color: 'secondary',
    })

    await toast.present()
  }

  protected readonly Object = Object
}
