import { Component, Input, OnInit } from '@angular/core'
import { ModalController } from '@ionic/angular'
import { Product } from 'src/app/models/product.model'

@Component({
  selector: 'app-store-cart',
  templateUrl: './store-cart.page.html',
  styleUrls: ['./store-cart.page.scss'],
})
export class StoreCartPage implements OnInit {
  @Input() productsInCart: Product[]
  total = 0

  constructor(private modalCtrl: ModalController) {}

  async ngOnInit() {
    console.log(this.productsInCart)
    this.calculateTotals()
  }

  onPlaceOrder() {
    this.productsInCart.forEach((product) => {
      console.log(product)
    })
    this.modalCtrl.dismiss([...this.productsInCart])
  }

  private calculateTotals(): void {
    this.productsInCart.forEach((p) => {
      this.total += p.price * p.quantity
    })
  }
}
