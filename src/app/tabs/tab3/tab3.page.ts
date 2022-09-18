import { Component, OnInit } from '@angular/core';
import { IonRouterOutlet, ModalController, Platform, ToastController } from '@ionic/angular';
import { Product } from 'src/app/models/product.model';
import { companyStoreProducts } from 'src/data/storeData';

@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
})
export class Tab3Page implements OnInit {

  slideOptions = {
    slidesPerView: 'auto',
    autoplay: true,
    zoom: true,
    grabCursor: true
  };

  public cart: Product[] = [];
  public products: Product[] = [];
  public isDesktop = false;

  constructor(
    public toastController: ToastController,
    public modalController: ModalController,
    private routerOutlet: IonRouterOutlet,
    private platform: Platform) { }


  ngOnInit() {
    this.initProducts();

    this.isDesktop = this.platform.is('desktop');
  }

  public calculateCartQuantity(): number {
    return this.cart.reduce((accumulator, current) => accumulator + current.quantity, 0);
  }

  async openCartModal(): Promise<void> {
    if (this.cart.length > 0) {
      const modal: HTMLIonModalElement = await this.modalController.create({
        component: Tab3Page,
        swipeToClose: true,
        presentingElement: this.routerOutlet.nativeEl,
        componentProps: {
          productsInCart: this.cart
        }
      });

      modal.onDidDismiss().then((result) => {
        // Data will be undefined if cart was swiped closed or back button used
        if (result.data) {
          this.cart.length = 0;
          this.presentToast(`Thanks for your order!`);
        }
      });

      return await modal.present();
    }
  }

  async addToCart(product: Product): Promise<void> {
    if (product.name !== 'Ionic Headband') {
      const foundProduct = this.cart.find(p => p.name === product.name);
      if (foundProduct) {
        foundProduct.quantity += 1;
      } else {
        product.quantity = 1;
        this.cart.push(product);
      }

      await this.presentToast(`${product.name} added`);
    }
  }

  private async presentToast(message): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color: 'tertiary'
    });

    await toast.present();
  }

  private initProducts() {
    this.products = companyStoreProducts;
    //this.recommendedProducts = companyStoreProducts.filter(p => p.saleCategory === 'recommended');
  }
}
