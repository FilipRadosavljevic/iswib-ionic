import { Injectable, inject } from '@angular/core'
import { Auth } from '@angular/fire/auth'
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  Firestore,
  FirestoreDataConverter,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from '@angular/fire/firestore'
import { Product } from '../models/product.model'
import { take, tap } from 'rxjs/operators'
import { BehaviorSubject } from 'rxjs'

export interface OrderData {
  orderID: string
  timestamp: Date
  total: number
  products: Product[]
  image?: string
}

const productConverter: FirestoreDataConverter<Product> = {
  toFirestore: (product: Product) => ({
    name: product.name,
    price: product.price,
    sizes: product.orders,
    imageUrl: product.imageUrl,
  }),
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options)

    return new Product(snapshot.id, data['name'], data['price'], data['orders'], data['imageUrl'])
  },
}

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private auth = inject(Auth)
  private firestore = inject(Firestore)

  private _products$ = new BehaviorSubject<Product[]>([])
  readonly products = this._products$.asObservable()

  async fetchUserOrders(userID: string) {
    const orders: OrderData[] = []
    const q = query(
      collection(this.firestore, `orders/${userID}/orders`),
      orderBy('timestamp', 'desc'),
    )
    const dataSnapshot = await getDocs(q)
    dataSnapshot.forEach((document) => {
      console.log(document.id)
      const order: OrderData = {
        orderID: document.id,
        timestamp: document.data()['timestamp'].toDate(),
        total: document.data()['total'],
        products: document.data()['products'],
      }
      orders.push(order)
    })
    return [...orders]
  }

  getProducts() {
    const productsRef = collection(this.firestore, 'products').withConverter(productConverter)

    return collectionData(productsRef).pipe(
      take(1),
      tap((products) => {
        console.log(products)
        this._products$.next(products as Product[])
      }),
    )
  }

  async fetchCart() {
    const dataSnapshot = await getDoc(doc(this.firestore, `carts/${this.auth.currentUser.uid}`))
    if (dataSnapshot.exists()) {
      console.log(dataSnapshot.data())
      const cart = dataSnapshot.data()['products'] as Product[]
      return [...cart]
    } else {
      console.log('No such document!')
      return []
    }
  }

  async placeOrder(products: Product[]) {
    console.log(products)
    try {
      const total = products.reduce((sum, p) => sum + p.totalPrice, 0)

      await addDoc(collection(this.firestore, `orders/${this.auth.currentUser.uid}/orders`), {
        products: [...products],
        total,
        timestamp: serverTimestamp(),
      })
      await deleteDoc(doc(this.firestore, `carts/${this.auth.currentUser.uid}`))
    } catch (e) {
      console.log(e)
    }
  }

  async deleteOrder(orderID: string) {
    await deleteDoc(doc(this.firestore, `orders/${this.auth.currentUser.uid}/orders/${orderID}`))
  }

  async placeCart(products: Product[]) {
    try {
      await setDoc(doc(this.firestore, `carts/${this.auth.currentUser.uid}`), {
        products: [...products],
      })
    } catch (e) {
      console.log(e)
    }
  }
}
