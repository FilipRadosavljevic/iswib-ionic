import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { getAuth } from 'firebase/auth';


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

}
