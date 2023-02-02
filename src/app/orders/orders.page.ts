/* eslint-disable max-len */
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { collection, doc, Firestore, getDocs, increment, updateDoc, writeBatch } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../services/auth/authentication.service';
import { OrderData, StoreService } from '../services/store.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit, OnDestroy {
  orderSub: Subscription;
  orders: OrderData[];
  total = 0;

  constructor(
    private storeService: StoreService,
    private firestore: Firestore,
    private http: HttpClient,
    private auth: Auth,
    public authService: AuthenticationService,
  ) { }

  ngOnInit() {
    this.orderSub = this.storeService.orders
    .subscribe(orders => {
      this.orders = orders;
    });
  }

  ngOnDestroy() {
    if(this.orderSub) {
      this.orderSub.unsubscribe();
    }
  }

  async ionViewWillEnter() {
    await this.storeService.fetchAllOrders();
  }

  async increment(counterID: string) {
    const shardID = Math.floor(Math.random() * 10).toString();
    const shardRef = doc(this.firestore,`counters/${counterID}/shards/${shardID}`);
    return await updateDoc(shardRef, { count: increment(1) });
  }

  async getCount(counterID: string) {
    const dataSnapshot = await getDocs(collection(this.firestore,`counters/${counterID}/shards`));
    let total = 0;
    dataSnapshot.forEach(document => {
      total += document.data().count;
    });
    this.total = total;
  }

  async onInitializeShards(counterID: string) {
    const batch = writeBatch(this.firestore);
    batch.set(doc(this.firestore,`counters/${counterID}`), { numShards: 10 });
    for(let i = 0; i < 10; i++) {
      const shardRef = doc(this.firestore,`counters/${counterID}/shards/${i.toString()}`);
      batch.set(shardRef, { count: 0 });
    }
    return await batch.commit();
  }

  /*async writeToSheet() {
    const sheetID = '1I6GAqALwRt0WfZ-scsb91UdFFEvenJjP8a6a5BsFLSk';
    const token = 'ya29.a0Aa4xrXP7Ha2dI9980ZjSOvjzuAaPru-Ct2xbXQU0_dun5wyXsggH4qREmYPW4B2caRGc34aRQYwopf43t33U_pIrJfF_1NhCWyMlFODW4-rk18zPUq5PeX4FJzUixxm5ktHnU7Da_dk8QszffRefbYbOmQ64aCgYKATASARASFQEjDvL9xOM0J1RP4plEUOV3eV7mAw0163';
    this.http.post(`https://script.googleapis.com/v1/scripts/AKfycbwn6VT6UHbM3wAVGHTX9_Qqtq9JU1-GlzvpU-9CjpEOkgpiWyYAzsz9U_Lx3hNr0LTy:run`)
    .subscribe(resData => {
      console.log(resData);
    });
  }*/

}
