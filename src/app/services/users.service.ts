import { Injectable } from '@angular/core';
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

  constructor() { }

  setUser(user: User) {
    this.user = user;
  }

  getUser() {
    const auth = getAuth();
    if(auth.currentUser) {
      return auth.currentUser;
    }
  }

  getUserId() {
    const auth = getAuth();
    if(auth.currentUser) {
      return auth.currentUser.uid;
    }
  }

}
