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
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc } from '@angular/fire/firestore';
import { companyStoreProducts } from 'src/data/storeData';
import { Product } from '../models/product.model';
import { DataService } from './data.service';

export interface OrderData {
  orderID: string;
  timestamp: Date;
  total: number;
  products: Product[];
}

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private dataService: DataService,
  ) { }

  async fetchUserOrders(userID: string) {
    return await this.dataService.getUserOrdersByID(userID);
  }

  fetchProducts() {
    return companyStoreProducts;
  }

  async fetchCart() {
    return await this.dataService.getUserCartByID(this.auth.currentUser.uid);
  }

  async placeOrder(products: Product[]) {
    console.log(products);
    try{
      let total = 0;
      products.forEach(p => {
        total += (p.price * p.quantity);
      });
      await addDoc(collection(this.firestore,`orders/${this.auth.currentUser.uid}/orders`),
      {
        products: [...products],
        total,
        timestamp: serverTimestamp()
      });
      await deleteDoc(doc(this.firestore,`carts/${this.auth.currentUser.uid}`));
    } catch(e) {
      console.log(e);
    }
  }

  async deleteOrder(orderID: string) {
    await deleteDoc(doc(this.firestore,`orders/${this.auth.currentUser.uid}/orders/${orderID}`));
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
