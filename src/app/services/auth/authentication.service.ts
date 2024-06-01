/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core'
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from '@angular/fire/auth'
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore'
// import { Preferences } from '@capacitor/preferences';
import { BehaviorSubject } from 'rxjs'
import { map, take } from 'rxjs/operators'
import { User } from 'src/app/models/user.model'

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private storageKey = 'authData'
  private _user = new BehaviorSubject<User>(null)

  private userConverter = {
    toFirestore: (user: User) => ({
      userID: user.userID,
      role: user.role,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profilePic: user.profilePic,
    }),
    fromFirestore: (snapshot, options) => {
      const data = snapshot.data(options)
      return new User(
        data.userID,
        data.role,
        data.firstName,
        data.lastName,
        data.email,
        data.profilePic,
      )
    },
  }

  constructor(
    private auth: Auth,
    private firestore: Firestore,
  ) {}

  get user() {
    return this._user.asObservable()
  }

  get userID() {
    return this._user.asObservable().pipe(
      map((user) => {
        if (user) {
          return user.userID
        } else {
          return null
        }
      }),
    )
  }

  get userLoggedIn() {
    return this._user.asObservable().pipe(map((user) => !!user))
  }

  // async autoLogin() {
  //   console.log('Entered autoLogin');
  //   try{
  //     const storedData = await Preferences.get({key: this.storageKey});
  //     console.log(storedData);
  //     if(!storedData || !storedData.value){
  //       return false;
  //     }
  //     const user = JSON.parse(storedData.value) as User;
  //     console.log(user);
  //     this._user.next(user);
  //   } catch(error) {
  //     console.error(error);
  //
  //   }
  // }

  async register({ email, password, firstName, lastName, confirmPassword }) {
    try {
      const userCredentials = await createUserWithEmailAndPassword(this.auth, email, password)
      const newUser = new User(
        userCredentials.user.uid,
        'STD',
        firstName,
        lastName,
        userCredentials.user.email,
        'default',
      )
      //await set(ref(getDatabase(), 'users/' + userCredentials.user.uid), newUser);
      await setDoc(
        doc(this.firestore, `users/${userCredentials.user.uid}`).withConverter(this.userConverter),
        newUser,
      )
      this._user.next(newUser)
      // Preferences.set({
      //   key: this.storageKey,
      //   value: JSON.stringify(newUser)
      // });
      console.log(newUser)
      return newUser
    } catch (e) {
      console.error(e)
      return null
    }
  }

  async login({ email, password }) {
    try {
      const userCredentials = await signInWithEmailAndPassword(this.auth, email, password)
      //const dataSnapshot = await get(ref(getDatabase(), 'users/' + userCredentials.user.uid));
      const dataSnapshot = await getDoc(
        doc(this.firestore, `users/${userCredentials.user.uid}`).withConverter(this.userConverter),
      )
      const user = dataSnapshot.data()
      console.log(user)
      // await Preferences.set({
      //   key: this.storageKey,
      //   value: JSON.stringify(user)
      // });
      this._user.next(user)
      return user
    } catch (e) {
      console.error(e)
      return null
    }
  }

  async recover({ email }): Promise<void> {
    try {
      return await sendPasswordResetEmail(this.auth, email)
    } catch (e) {
      console.log(e)
      return null
    }
  }

  async logout() {
    // await Preferences.remove({ key: this.storageKey });
    this._user.next(null)
    await signOut(this.auth)
  }
}
