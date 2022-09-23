/* eslint-disable max-len */
import { Injectable } from '@angular/core';

import { collectionData, collection,  docData, Firestore, doc, updateDoc, getDocs, writeBatch, getDoc, query, orderBy } from '@angular/fire/firestore';
import { Huddle } from '../models/huddle.model';
import { Product } from '../models/product.model';
import { User } from '../models/user.model';
import { OrderData } from './store.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private firestore: Firestore) {}

  async getUserOrdersByID(userID: string) {
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

  async getUserCartByID(userID: string) {
    const dataSnapshot = await getDoc(doc(this.firestore,`carts/${userID}`));
    if (dataSnapshot.exists()) {
      console.log(dataSnapshot.data());
      const cart = dataSnapshot.data().products as Product[];
      return [...cart];
    } else {
      console.log('No such document!');
      return [];
    }
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

  async getSchedule() {
    return await getDocs(collection(this.firestore, 'schedule'));
  }

  async getRestaurants() {
    return await getDocs(collection(this.firestore, 'restaurants'));
  }

  getWorkshops() {
    const workshopsRef = collection(this.firestore, 'workshops');
    return collectionData(workshopsRef);
  }

  getSponsors() {
    const sponsorsRef = collection(this.firestore, 'sponsors');
    return collectionData(sponsorsRef);
  }

  getDiscovery() {
    const discoveryRef = collection(this.firestore, 'discovery');
    return collectionData(discoveryRef);
  }
}
