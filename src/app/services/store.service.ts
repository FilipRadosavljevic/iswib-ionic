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
  ) { }

  async fetchUserOrders(userID: string) {
    const orders: OrderData[] = [];
    const q = query(collection(this.firestore,`orders/${userID}/orders`), orderBy('timestamp', 'desc'));
    const dataSnapshot = await getDocs(q);
    dataSnapshot.forEach((document) => {
      console.log(document.id);
      const order: OrderData = {
        orderID: document.id,
        timestamp: document.data().timestamp.toDate(),
        total: document.data().total,
        products: document.data().products

      };
      orders.push(order);
    });
    return [...orders];
  }

  fetchProducts() {
    return companyStoreProducts;
  }

  async fetchCart() {
    const dataSnapshot = await getDoc(doc(this.firestore,`carts/${this.auth.currentUser.uid}`));
    if (dataSnapshot.exists()) {
      console.log(dataSnapshot.data());
      const cart = dataSnapshot.data().products as Product[];
      return [...cart];
    } else {
      console.log('No such document!');
      return [];
    }
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
