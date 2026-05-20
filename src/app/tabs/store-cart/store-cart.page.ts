import { Component, OnInit, inject, input } from '@angular/core'
import { ModalController, IonicModule } from '@ionic/angular'
import { Product } from 'src/app/models/product.model'
import { CurrencyPipe } from '@angular/common'

@Component({
  selector: 'app-store-cart',
  templateUrl: './store-cart.page.html',
  styleUrls: ['./store-cart.page.scss'],
  imports: [IonicModule, CurrencyPipe],
})
export class StoreCartPage implements OnInit {
  private modalCtrl = inject(ModalController)

  readonly productsInCart = input<Product[]>(undefined)
  total = 0

  async ngOnInit() {
    console.log(this.productsInCart())
    this.calculateTotals()
  }

  onPlaceOrder() {
    this.productsInCart().forEach((product) => {
      console.log(product)
    })
    this.modalCtrl.dismiss([...this.productsInCart()])
  }

  private calculateTotals(): void {
    this.productsInCart().forEach((p) => {
      this.total += p.price * p.totalPrice
    })
  }
}
