import { Injectable } from '@angular/core';
import { collectionData, collection,  docData, Firestore, doc, setDoc } from '@angular/fire/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';


export interface User {
  email: string;
  userID: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private user: User;

  constructor(private firestore: Firestore) { }

  setUser(user: User) {
    this.user = user;
  }

  getUserId() {
    const auth = getAuth();
    return auth.currentUser.uid;
  }

  setUserToDB(username, id) {
    const userRef = doc(this.firestore, `users/${id}`);
    setDoc(userRef, { email: username, uid: id });
  }
}
