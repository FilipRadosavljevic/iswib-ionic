import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonRouterOutlet, ModalController, ToastController } from '@ionic/angular';
import { Product } from 'src/app/models/product.model';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import { StoreService } from 'src/app/services/store.service';
import { StoreCartPage } from '../store-cart/store-cart.page';

@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
})
export class Tab3Page implements OnInit {

  public cart: Product[] = [];
  public products: Product[] = [];

  constructor(
    public authService: AuthenticationService,
    private storeService: StoreService,
    private alertController: AlertController,
    public toastController: ToastController,
    public modalController: ModalController,
    private routerOutlet: IonRouterOutlet,
    private router: Router) { }


  async ngOnInit() {
    this.products = this.storeService.fetchProducts();
    this.cart = await this.storeService.fetchCart();
  }

  async ionViewWillEnter() {
    this.cart = await this.storeService.fetchCart();
  }

  async redirectLogin(header: string) {
    const alert = await this.alertController.create({
      header,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Log In',
          role: 'confirm',
          handler: () => {
            this.router.navigateByUrl('/', {replaceUrl: true});
          }
        }
      ]
    });
    await alert.present();
  }

  public calculateCartQuantity(): number {
    return this.cart.reduce((accumulator, current) => accumulator + current.quantity, 0);
  }

  async openCartModal() {
    console.log(this.cart);
    console.log(this.products);
    if (this.cart.length > 0) {
      const modal = await this.modalController.create({
        component: StoreCartPage,
        swipeToClose: true,
        presentingElement: this.routerOutlet.nativeEl,
        componentProps: {
          productsInCart: this.cart
        },

      });
      modal.present();
      const orderData = (await modal.onDidDismiss()).data as Product[];
      if (orderData) {
        console.log(orderData);
        this.cart.length = 0;
        this.storeService.placeOrder(orderData);
        this.presentToast(`Thanks for your order!`);
      }
    }
  }

  async addToCart(product: Product) {
      const foundProduct = this.cart.find(p => p.name === product.name);
      if (foundProduct) {
        foundProduct.quantity += 1;
      } else {
        product.quantity = 1;
        this.cart.push(product);
      }
      this.storeService.placeCart(this.cart);

      await this.presentToast(`${product.name} added`);
  }

  private async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color: 'secondary'
    });

    await toast.present();
  }
}
