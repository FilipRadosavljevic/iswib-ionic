/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { addDoc, arrayRemove, arrayUnion, collection, deleteDoc, doc, Firestore, getDocs, updateDoc } from '@angular/fire/firestore';
import { setDoc } from 'firebase/firestore';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';
import { Huddle } from '../models/huddle.model';
import { DataService } from './data.service';



@Injectable({
  providedIn: 'root'
})
export class HuddleService {
  private _huddles = new BehaviorSubject<Huddle[]>([]);

  private huddleConverter = {
    toFirestore: (huddle: Huddle) => ({
      //huddleID: huddle.huddleID,
      creatorID: huddle.creatorID,
      huddleDay: huddle.huddleDay,
      time: huddle.time,
      title: huddle.title,
      description: huddle.description,
      userIDs: huddle.userIDs,
    }),
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new Huddle(
          snapshot.id,
          data.creatorID,
          data.huddleDay,
          data.time,
          data.title,
          data.description,
          data.userIDs,
        );
    }
  };

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

  async fetchHuddlesByUserID(userID: string) {
    const huddles = await this.dataService.getHuddlesByUserID(userID);
    this._huddles.next(huddles);
  }

  async fetchAllHuddles() {
    const huddlesSnapshot = await getDocs(collection(this.firestore, 'huddles').withConverter(this.huddleConverter));
    const huddles = [];
    huddlesSnapshot.forEach(huddleDoc => {
      console.log(huddleDoc.id, ' => ', huddleDoc.data());
      huddles.push(huddleDoc.data());
    });
    console.log(huddles);
    this._huddles.next(huddles);
  }

  deleteHuddle(index: number, huddleID: string, huddleDay: number,) {
    return from(deleteDoc(doc(this.firestore,`huddles/${huddleDay}/huddles/${huddleID}`)))
    .pipe(
      switchMap(_ => this.huddles),
      take(1),
      tap(huddles => {
        huddles.splice(index, 1);
        this._huddles.next(huddles);
      })
    );
  }

  editHuddle(
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

    const newHuddleRef = doc(collection(this.firestore, `huddles`))
    .withConverter(this.huddleConverter);

    const newHuddle = new Huddle(
      newHuddleRef.id,
      creatorID,
      huddleDay,
      time,
      title,
      description,
      userIDs,
     // image
    );

    return from(setDoc(newHuddleRef, newHuddle))
    .pipe(
      switchMap(_ => this.huddles),
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
}
