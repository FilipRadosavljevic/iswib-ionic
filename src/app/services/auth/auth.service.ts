/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core'
import {
  Auth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  user,
} from '@angular/fire/auth'
import { Firestore, doc, getDoc, FirestoreDataConverter } from '@angular/fire/firestore'
import { Observable } from 'rxjs'
import { shareReplay, switchMap } from 'rxjs/operators'
import { User } from 'src/app/models/user.model'
import { Functions, httpsCallable } from '@angular/fire/functions'
import { CreateUserRequestData } from '../../models/create-user.model'

const userConverter: FirestoreDataConverter<User> = {
  toFirestore: (user: User) => ({
    userId: user.userId,
    role: user.role,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    workshopId: user.workshopId,
  }),
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options)

    return new User(
      snapshot.id,
      data.role,
      data.firstName,
      data.lastName,
      data.email,
      data.workshopId,
    )
  },
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _user$: Observable<User | null>

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private functions: Functions,
  ) {
    this._user$ = user(this.auth).pipe(
      switchMap(async (user) => {
        if (!user) {
          return null
        }

        const userDocRef = doc(this.firestore, 'users', user.uid).withConverter(userConverter)

        const docSnap = await getDoc(userDocRef)

        return docSnap.exists() ? docSnap.data() : null
      }),
    )
  }

  get user() {
    return this._user$.pipe(shareReplay(1))
  }

  async createUserRequest(userRequestData: CreateUserRequestData) {
    this.functions.region = 'europe-central2'

    await httpsCallable<CreateUserRequestData>(this.functions, 'createUserRequest')(userRequestData)
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password)
  }

  recover(email: string) {
    return sendPasswordResetEmail(this.auth, email)
  }

  logout() {
    return signOut(this.auth)
  }
}
