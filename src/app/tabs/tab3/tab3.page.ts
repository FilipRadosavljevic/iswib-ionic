/* eslint-disable max-len */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { doc, Firestore, runTransaction } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { ActionSheetController, AlertController, IonRouterOutlet, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/models/product.model';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import { StoreService } from 'src/app/services/store.service';
import { StoreCartPage } from '../store-cart/store-cart.page';

@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
})
export class Tab3Page implements OnInit, OnDestroy {

  public cart: Product[] = [];
  public cartErrorData: {
    error: boolean;
    errorIndexes: number[];
    quantities: number[];
  };
  public products: Product[] = [];
  public showcasedProducts: Product[] = [];
  cartSub: Subscription;
  productSub: Subscription;

  constructor(
    private firestore: Firestore,
    public authService: AuthenticationService,
    private storeService: StoreService,
    private alertController: AlertController,
    public toastController: ToastController,
    public modalController: ModalController,
    private routerOutlet: IonRouterOutlet,
    private loadingCtrl: LoadingController,
    private actionSheetCtrl: ActionSheetController,
    private router: Router) { }

  ngOnDestroy() {
    if(this.cartSub) {
      this.cartSub.unsubscribe();
    }
    if(this.productSub) {
      this.productSub.unsubscribe();
    }
  }

  async ngOnInit() {
    this.cartSub = this.storeService.cart
    .subscribe(cart => {
      this.cart = cart;
    });
    this.productSub = this.storeService.products
    .subscribe(products => {
      this.products = products;
      this.showcasedProducts = products.filter(p => !p.size || p.size === 'L');
    });
  }

  ionViewWillEnter() {
    console.log('ionView');
    /*const loadingEl = await this.loadingCtrl.create({
      message: 'Loading...',
    });
    loadingEl.present();*/
    this.storeService.fetchCart().subscribe(cart => {
      this.cart = cart;
    });
    this.storeService.fetchProducts().subscribe(products =>{
      this.products = products;
      console.log(products);
      this.showcasedProducts = products.filter(p => p.size === undefined || p.size === 'L');
    });
    //loadingEl.dismiss();
  }

  public calculateCartQuantity(): number {
    return this.cart.reduce((accumulator, current) => accumulator + current.quantity, 0);
  }

  async openCartModal() {
    if (this.cart.length <= 0) {
      return;
    }
    const modal = await this.modalController.create({
      component: StoreCartPage,
      canDismiss: true,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: {
        productsInCart: this.cart,
        errorData: this.cartErrorData,
      },

    });
    //console.log('before present');
    await modal.present();
    //console.log('after present, before dismiss');
    const orderData = (await modal.onDidDismiss()).data as Product[];
    //console.log('after dismiss');
    if (!orderData) {
      return;
    }
    console.log(orderData);
    const transactionData = await this.storeService.placeOrder(orderData);
    console.log(transactionData);
    orderData.forEach((o,i) => {
      const foundProduct = this.products.find(p => p.productID === o.productID);
      console.log(foundProduct);
      foundProduct.quantity = transactionData.quantities[i];
    });
    //console.log(this.products);
    if(transactionData.error) {
      this.cartErrorData = transactionData;
      this.presentToast('There was a problem with your order.\nCheck your cart', 5000, 'danger');
    } else {
      this.cart.length = 0;
      this.presentToast(`Thanks for your order!`);
    }
  }

  async chooseSize() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Choose Size',
      cssClass: 'my-custom-class',
      buttons: [
        {
          text: 'S (35-38)',
          role: 'destructive',
          data: {
            size: 'S',
          },
        },
        {
          text: 'M (39-42)',
          role: 'destructive',
          data: {
            size: 'M',
          },
        },
        {
          text: 'L (43-46)',
          role: 'destructive',
          data: {
            size: 'L',
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
          data: {
            action: 'cancel',
          },
        },
      ],
    });

    await actionSheet.present();
    const result = await actionSheet.onDidDismiss();
    console.log(result);
    if(result.role !== 'cancel'){
      const product = this.products.find(p => p.size === result.data.size);
      console.log(product);
      this.addToCart(product, result.data.size);
    }
  }

  async addToCart(product: Product, size?: string) {
    console.log(this.products);
    if(product.quantity <= 0) {
      return;
    }
    const foundCartProduct = this.cart.find(p =>
       p.productID === product.productID && (size? p.size === size : true));
    if(foundCartProduct) {
      foundCartProduct.quantity += 1;
    } else {
      const newCartProduct = new Product(
        product.productID,
        product.name,
        product.price,
        product.image,
        1,
        size ?? null
      );
      console.log(newCartProduct);
      this.cart.push({...newCartProduct});
      }
      console.log(this.cart);
      //await this.storeService.placeCart(this.cart);
      await this.presentToast(`${product.name} added`);
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

  private async presentToast(message: string, duration = 2000, color = 'secondary') {
    const toast = await this.toastController.create({
      message,
      duration,
      color,
      buttons: [
        {
          text: 'Dismiss',
          role: 'cancel'
        }
      ]
    });

    await toast.present();
  }
}
