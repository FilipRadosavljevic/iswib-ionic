/* eslint-disable no-underscore-dangle */
import {Injectable} from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut
} from '@angular/fire/auth';
import {get, getDatabase, ref, set} from '@angular/fire/database';
import {BehaviorSubject} from 'rxjs';
import {map} from 'rxjs/operators';
import {User} from 'src/app/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private storageKey = 'authData';
  private _user = new BehaviorSubject<User>(null);

  constructor(private auth: Auth) { }

  get user() {
    return this._user.asObservable();
  }

  get userID() {
    return this._user.asObservable()
      .pipe(
        map(user => {
          if (user) {
            return user.userID;
          } else {
            return null;
          }
        })
      );
  }

  get userLoggedIn() {
    return this._user.asObservable()
      .pipe(
        map(user => !!user)
      );
  }

  // async autoLogin() {
  //   console.log('Entered autoLogin');
  //   try{
  //     const storedData = await Preferences.get({key: this.storageKey});
  //     if(!storedData || !storedData.value){
  //       return false;
  //     }
  //     const user = JSON.parse(storedData.value) as User;
  //     this._user.next(user);
  //   } catch(error) {
  //     console.error(error);
  //
  //   }
  // }

  async register({email,password,firstName,lastName,confirmPassword}) {
    try {
      const userCredentials = await createUserWithEmailAndPassword(this.auth, email, password);
      const newUser = new User(
        userCredentials.user.uid,
        'STD',
        firstName,
        lastName,
        userCredentials.user.email,
        'assets/images/defaultProfilePic.jpg'
      );
      await set(ref(getDatabase(), 'users/' + userCredentials.user.uid), newUser);
      this._user.next(newUser);
      // Preferences.set({
      //   key: this.storageKey,
      //   value: JSON.stringify(newUser)
      // });
      console.log(newUser);
      return newUser;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async login({ email, password }) {
    try {
      const userCredentials = await signInWithEmailAndPassword(this.auth, email, password);
      const dataSnapshot = await get(ref(getDatabase(), 'users/' + userCredentials.user.uid));
      const user = dataSnapshot.val() as User;
      this._user.next(user);
      // Preferences.set({
      //   key: this.storageKey,
      //   value: JSON.stringify(user)
      // });
      console.log(user);
      return user;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async recover({ email }): Promise<void> {
    try {
      return await sendPasswordResetEmail(this.auth, email);
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  logout() {
    this._user.next(null);
    // Preferences.remove({ key: this.storageKey });
    return signOut(this.auth);
  }

}
