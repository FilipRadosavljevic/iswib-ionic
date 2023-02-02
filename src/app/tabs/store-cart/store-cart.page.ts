import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { BehaviorSubject, fromEvent, Observable, of, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { Product } from 'src/app/models/product.model';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-store-cart',
  templateUrl: './store-cart.page.html',
  styleUrls: ['./store-cart.page.scss'],
})
export class StoreCartPage implements OnInit, OnDestroy {

  @Input() productsInCart: Product[];
  @Input() errorData: {
    error: boolean;
    errorIndexes: number[];
    quantities: number[];
  };
  total = 0;
  changedQs: number[];
  //cartObs = new Subject<{i: number; q: number}>();
  cartObs = new BehaviorSubject<number[]>([]);
  cartSub: Subscription;

  constructor(
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private storeService: StoreService,
  ) { }

  ngOnInit() {
    console.log('OnInit');
    console.log(!this.errorData);
    console.log(this.productsInCart);
    //this.changedQs = new Array(this.productsInCart.length).fill(-1);
    this.changedQs = this.productsInCart.map(p => p.quantity);
    this.cartObs.next([...this.changedQs]);
    this.cartSub = this.cartObs
    .pipe(
      debounceTime(500),
      //distinctUntilChanged((curr,prev) => curr.i === prev.i && curr.q === prev.q)
      distinctUntilChanged((curr,prev) => JSON.stringify(curr) === JSON.stringify(prev))
    )
    .subscribe(info => {
      this.addToCart(info);
      console.log(info);
    });
    this.calculateTotals();
  }

  ngOnDestroy() {
    console.log('OnDestroy');
    if(this.cartSub) {
      this.cartSub.unsubscribe();
    }
  }

  async addToCart(info: number[]) {
    console.log(info);
    info.forEach((q,i) => {
      this.productsInCart[i].quantity = q;
      this.productsInCart = this.productsInCart.filter(p => p.quantity > 0);
    });
    console.log(this.productsInCart);
    await this.storeService.placeCart(this.productsInCart);
  }

  onAddItem(index: number) {
    this.productsInCart[index].quantity += 1;
    this.calculateTotals();
    this.changedQs[index] = this.productsInCart[index].quantity;
    //this.cartObs.next({i: index, q: this.productsInCart[index].quantity});
    this.cartObs.next([...this.changedQs]);
  }

  async onRemoveItem(index: number) {
    if(this.productsInCart[index].quantity <= 1) {
      const alert = await this.alertCtrl.create({
        header: 'This will remove the product from your cart',
        message: 'Do you wish to proceed?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
          },
          {
            text: 'Yes',
            role: 'confirm',
            handler: () => {
              this.changedQs[index] = 0;
              //this.productsInCart.splice(index, 1);
              if(this.productsInCart.length > 0) {
                this.calculateTotals();
              } else {
                this.modalCtrl.dismiss(null, 'cancel');
              }
            }
          }
        ]
      });
      alert.present();
      //alert.onDidDismiss();
    } else {
      this.productsInCart[index].quantity -= 1;
      this.changedQs[index] = this.productsInCart[index].quantity;
      this.calculateTotals();
    }
    //this.cartObs.next({i: index, q: this.productsInCart[index].quantity});
    this.cartObs.next([...this.changedQs]);
  }



  onPlaceOrder() {
    this.productsInCart.forEach(product => {
      console.log(product);
    });
    this.modalCtrl.dismiss([...this.productsInCart]);
  }

  private calculateTotals(): void {
    this.total = 0;
    this.productsInCart.forEach(p => {
      this.total += (p.price * p.quantity);
    });
  }

}
