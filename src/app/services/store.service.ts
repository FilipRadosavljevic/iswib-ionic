/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  getDocs,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  writeBatch} from '@angular/fire/firestore';
import { LoadingController } from '@ionic/angular';
import { BehaviorSubject, from } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';
//import { companyStoreProducts } from 'src/data/storeData';
import { Product } from '../models/product.model';
import { User } from '../models/user.model';
import { AuthenticationService } from './auth/authentication.service';
import { DataService } from './data.service';

export interface OrderData {
  userID: string;
  userEmail: string;
  status: string;
  orderID: string;
  timestamp: Date;
  total: number;
  products: Product[];
}

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private _products = new BehaviorSubject<Product[]>([]);
  private _cart = new BehaviorSubject<Product[]>([]);
  private _orders = new BehaviorSubject<OrderData[]>([]);

  constructor(
    private authService: AuthenticationService,
    private auth: Auth,
    private firestore: Firestore,
    private dataService: DataService,
    private loadingCtrl: LoadingController,
  ) { }

  get products() {
    return this._products.asObservable();
  }

  get cart() {
    return this._cart.asObservable();
  }

  get orders() {
    return this._orders.asObservable();
  }

  fetchProducts() {
    return from(this.dataService.fetchProducts());
  }

  async fetchUserOrders(userID: string) {
    return await this.dataService.getUserOrdersByID(userID);
  }

  async fetchAllOrders() {
    const orders =  await this.dataService.getAllOrders();
    this._orders.next(orders);
  }

  fetchCart() {
    return this.authService.userID.pipe(
      take(1),
      switchMap(userID => from(this.dataService.getUserCartByID(userID))),
      /*tap(cart => {
        this._cart.next(cart);
      })*/
    );
  }

  async placeOrder(products: Product[]) {
    const loadingEl = await this.loadingCtrl.create({
      message: 'Placing Order...',
    });
    loadingEl.present();
    try {
      const transactionData = await runTransaction(this.firestore, async (transaction) => {
        const errorIndexes: number[] = [];
        const oldQuantities: number[] = [];
        const newQuantities: number[] = [];
        for (let i = 0; i < products.length; i++) {
          const docRef = doc(this.firestore,`products/${products[i].productID}`);
          const document = await transaction.get(docRef);
          if (!document.exists()) {
            throw new Error('Product ' + products[i].name + ' does not exist!');
          }
          console.log(document.data().quantity);
          console.log(products[i].quantity);
          if(document.data().quantity < products[i].quantity) {
            errorIndexes.push(i);
          }
          oldQuantities.push(document.data().quantity);
          newQuantities.push(document.data().quantity - products[i].quantity);
        }
        if(errorIndexes.length > 0) {
          return {
            error: true,
            errorIndexes,
            quantities: oldQuantities
          };
        }
        for (let i = 0; i < products.length; i++) {
          const docRef = doc(this.firestore,`products/${products[i].productID}`);
          transaction.update(docRef, { quantity: newQuantities[i] });
        }
        return {
          error: false,
          errorIndexes: null,
          quantities: newQuantities
        };
      });
      if(!transactionData.error) {
        this.authService.user.pipe(
          take(1),
        )
        .subscribe(async user => {
          const total = products.reduce((acc, p) => acc + p.quantity * p.price, 0);
          await addDoc(collection(this.firestore, 'orders'),
          {
            userID: user.userID,
            userEmail: user.email,
            status: 'Pending',
            products: [...products],
            total,
            timestamp: serverTimestamp()
          });
          await deleteDoc(doc(this.firestore,`carts/${this.auth.currentUser.uid}`));
        });
      }
      loadingEl.dismiss();
      return transactionData;
    } catch(error) {
      loadingEl.dismiss();
      console.log('Transaction failed: ', error);
    }
  }

  async deleteOrder(orderID: string) {
    await deleteDoc(doc(this.firestore,`orders/${orderID}`));
  }

  async placeCart(products: Product[]) {
    try{
      await setDoc(doc(this.firestore,`carts/${this.auth.currentUser.uid}`),
      {
        products: [...products]
      });
    } catch(e) {
      console.log(e);
    }
  }
}
