/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { addDoc, arrayRemove, arrayUnion, collection, doc, Firestore, updateDoc } from '@angular/fire/firestore';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';
import { Huddle } from '../models/huddle.model';
import { DataService } from './data.service';



@Injectable({
  providedIn: 'root'
})
export class HuddleService {
  private _huddles = new BehaviorSubject<Huddle[]>([]);

  constructor(
    private dataService: DataService,
    private firestore: Firestore,
  ) { }

  get huddles() {
    return this._huddles.asObservable();
  }

  async fetchHuddlesByDay(huddleDay: number) {
    const huddles = await this.dataService.getHuddlesByDay(huddleDay);
    const huddlesData = await this.dataService.getHuddleDataByDay(huddleDay);
    this._huddles.next(huddles);
    return huddlesData;
  }

  updateHuddle(
    index: number,
    huddleID: string,
    huddleDay: number,
    time: string,
    title: string,
    description: string
    //image: string
  ) {
    return from(updateDoc(doc(this.firestore,`huddles/${huddleDay}/huddles/${huddleID}`),
    {
      description,
      time,
      title,
    })).pipe(
      switchMap(_ => this.huddles),
      take(1),
      tap(huddles => {
        huddles[index].time = time;
        huddles[index].title = title;
        huddles[index].description = description;
        this._huddles.next(huddles);
      })
    );
  }

  addHuddle(
    huddleDay: number,
    creatorID: string,
    time: string,
    title: string,
    description: string,
    userIDs: string[],
    //image: string
  ) {
    const newHuddle = new Huddle(
      null,
      creatorID,
      time,
      title,
      description,
      userIDs,
     // image
    );
    return from(addDoc(collection(this.firestore,`huddles/${huddleDay}/huddles`),
    {
      creatorID,
      description,
      time,
      title,
      userIDs,
    })).pipe(
      switchMap(docRef => {
        newHuddle.huddleID = docRef.id;
        return this.huddles;
      }),
      take(1),
      tap(huddles => {
        this._huddles.next(huddles.concat(newHuddle));
      })
    );
  }

  updateHuddleUsers(
    huddleDay: number,
    huddleID: string,
    userID: string,
    index: number,
    mode: 'leave' | 'join'
  ) {
    return from(updateDoc(doc(this.firestore,`huddles/${huddleDay}/huddles/${huddleID}`),
    {
      userIDs: (mode === 'join'? arrayUnion(userID) : arrayRemove(userID))
    })).pipe(
      switchMap(_ => this.huddles),
      take(1),
      tap(huddles => {
        if(mode === 'join') {
          huddles[index].userIDs.push(userID);
        } else {
          const ind = huddles[index].userIDs.indexOf(userID);
          huddles[index].userIDs.splice(ind, 1);
        }
        this._huddles.next(huddles);
      })
    );
  }

  /*cancelBooking(bookingId: string) {
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.delete(`https://bookingapp-a6b80-default-rtdb.europe-west1.firebasedatabase.app/bookings/${bookingId}.json?auth=${token}`);
      }),
      switchMap(() => this.bookings),
      take(1),
      tap(bookings => {
        this._bookings.next(bookings.filter(b => b.id !== bookingId));
      })
    );
  }

  fetchBookings() {
    let fetchedUserId: string;
    return this.authService.userId.pipe(
      take(1),
      switchMap(userId => {
        if (!userId) {
          throw new Error('Found no user.');
        }
        fetchedUserId = userId;
        return this.authService.token;
      }),
      take(1),
      switchMap(token => {
        return this.http
          .get<{ [key: string]: BookingData }>(`https://bookingapp-a6b80-default-rtdb.europe-west1.firebasedatabase.app/bookings.json?orderBy="userId"&equalTo="${fetchedUserId}"&auth=${token}`);
      }),
      map(bookingData => {
        const bookings = [];
        for (const key in bookingData) {
          if (bookingData.hasOwnProperty(key)) {
            bookings.push(new Booking(
              key,
              bookingData[key].placeId,
              bookingData[key].userId,
              bookingData[key].placeTitle,
              bookingData[key].placeImage,
              bookingData[key].firstName,
              bookingData[key].lastName,
              bookingData[key].guestNumber,
              new Date(bookingData[key].bookedFrom),
              new Date(bookingData[key].bookedTo)
            ));
          }
        }
        return bookings;
      }),
      tap(bookings => {
        this._bookings.next(bookings);
      })
    );
  }*/
}
