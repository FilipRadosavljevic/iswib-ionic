/* eslint-disable max-len */
import { Injectable } from '@angular/core';

import { collectionData, collection, docData, Firestore, doc, updateDoc, getDocs, writeBatch, getDoc, query, orderBy, where } from '@angular/fire/firestore';
import { Huddle } from '../models/huddle.model';
import { Product } from '../models/product.model';
import { User } from '../models/user.model';
import { Currency } from './currency.service';
import { OrderData } from './store.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private firestore: Firestore) { }

  async fetchProducts() {
    const products: Product[] = [];
    const productData = await getDocs(collection(this.firestore, 'products'));
    productData.forEach(document => {
      const newProduct = new Product(
        document.id,
        document.data().name,
        document.data().price,
        document.data().image,
        document.data().quantity,
        document.data().size,
      );
      products.push(newProduct);
    });
    return products;
  }

  async getAllOrders() {
    const orders: OrderData[] = [];
    const q = query(collection(this.firestore, 'orders'), orderBy('timestamp', 'desc'));
    const dataSnapshot = await getDocs(q);
    dataSnapshot.forEach(document => {
      const order: OrderData = {
        userID: document.data().userID,
        userEmail: document.data().userEmail,
        status: document.data().status,
        orderID: document.id,
        timestamp: document.data().timestamp.toDate(),
        total: document.data().total,
        products: document.data().products
      };
      orders.push(order);
    });
    return [...orders];
  }

  async getUserOrdersByID(userID: string) {
    const orders: OrderData[] = [];
    const q = query(collection(this.firestore, 'orders'), where('userID', '==', userID), orderBy('timestamp', 'desc'));
    const dataSnapshot = await getDocs(q);
    dataSnapshot.forEach((document) => {
      console.log(document.id);
      const order: OrderData = {
        userID: document.data().userID,
        userEmail: document.data().userEmail,
        status: document.data().status,
        orderID: document.id,
        timestamp: document.data().timestamp.toDate(),
        total: document.data().total,
        products: document.data().products
      };
      orders.push(order);
    });
    return [...orders];
  }

  async getUserCartByID(userID: string) {
    const dataSnapshot = await getDoc(doc(this.firestore, `carts/${userID}`));
    if (dataSnapshot.exists()) {
      console.log(dataSnapshot.data());
      const cart = dataSnapshot.data().products as Product[];
      return [...cart];
    } else {
      console.log('No such document!');
      return [];
    }
  }

  async getHuddlesByUserID(userID: string) {
    const huddles: Huddle[] = [];
    const huddleDays = [];
    const huddlesData = await getDocs(collection(this.firestore, `huddles`));
    huddlesData.forEach(dayDocument => {
      huddleDays.push(dayDocument.id);
    });
    for (const huddleDay in huddleDays) {
      if (huddleDays.hasOwnProperty(huddleDay)) {
        const huddlesDataByDay = await getDocs(collection(this.firestore, `huddles/${huddleDay}/huddles`));
        huddlesDataByDay.forEach(document => {
          console.log(document.id);
          if (document.data().userIDs.includes(userID)) {
            console.log(document.data().userIDs);
            const huddle = new Huddle(
              document.id,
              document.data().creatorID,
              +huddleDay,
              document.data().time,
              document.data().title,
              document.data().description,
              document.data().userIDs
            );
            huddles.push({ ...huddle });
          }
        });
      }
    }
    return [...huddles];
  }

  async getHuddlesByDay(huddleDay: number) {
    const huddles: Huddle[] = [];
    const huddlesData = await getDocs(collection(this.firestore, `huddles/${huddleDay}/huddles`));
    huddlesData.forEach(document => {
      console.log(document.id);
      console.log(document.data());
      const huddle = new Huddle(
        document.id,
        document.data().creatorID,
        +huddleDay,
        document.data().time,
        document.data().title,
        document.data().description,
        document.data().userIDs
      );
      huddles.push(huddle);
    });
    return [...huddles];
  }

  async getHuddleDataByDay(huddleDay: number) {
    const huddleData = await getDoc(doc(this.firestore, `huddles/${huddleDay}`));
    return {
      timeFrom: huddleData.data().timeFrom.toDate(),
      timeTo: huddleData.data().timeTo.toDate(),
    };
  }

  async getCurrencies() {
    const currencies: Currency[] = [];
    const currData = await getDocs(collection(this.firestore, 'currencies'));
    currData.forEach(document => {
      currencies.push(document.data() as Currency);
    });
    return [...currencies];
  }

  async getSchedule() {
    return await getDocs(collection(this.firestore, 'schedule'));
  }

  async getRestaurants() {
    return await getDocs(collection(this.firestore, 'restaurants'));
  }

  async getWorkshops() {
    return await getDocs(collection(this.firestore, 'workshops'));
  }

  async getSponsors() {
    return await getDocs(collection(this.firestore, 'sponsors'));
  }

  async getDiscovery() {
    return await getDocs(collection(this.firestore, 'discovery'));
  }
}
