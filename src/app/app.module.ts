import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { RouteReuseStrategy } from '@angular/router'
import { IonicModule, IonicRouteStrategy } from '@ionic/angular'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { HttpClientModule } from '@angular/common/http'

// Firebase
import { provideFirebaseApp, initializeApp } from '@angular/fire/app'
import { connectFirestoreEmulator, getFirestore, provideFirestore } from '@angular/fire/firestore'
import { environment } from 'environments/environment'
import {
  provideAuth,
  getAuth,
  initializeAuth,
  indexedDBLocalPersistence,
  connectAuthEmulator,
} from '@angular/fire/auth'
import { Capacitor } from '@capacitor/core'
import { provideStorage, getStorage, connectStorageEmulator } from '@angular/fire/storage'
import { connectFunctionsEmulator, getFunctions, provideFunctions } from '@angular/fire/functions'

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, HttpClientModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideFirebaseApp(() => {
      const app = initializeApp(environment.firebaseConfig)
      if (Capacitor.isNativePlatform) {
        initializeAuth(app, {
          persistence: indexedDBLocalPersistence,
        })
      }
      return app
    }),
    provideAuth(() => {
      const auth = getAuth()
      if (location.hostname === 'localhost') {
        connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true })
      }
      return auth
    }),
    provideFirestore(() => {
      const firestore = getFirestore()
      if (location.hostname === 'localhost') {
        console.log('connecting to firestore emulator')
        connectFirestoreEmulator(firestore, 'localhost', 8080)
      }

      return firestore
    }),
    provideStorage(() => {
      const storage = getStorage()
      if (location.hostname === 'localhost') {
        connectStorageEmulator(storage, '127.0.0.1', 9199)
      }
      return storage
    }),
    provideFunctions(() => {
      const functions = getFunctions()
      if (location.hostname === 'localhost') {
        connectFunctionsEmulator(functions, '127.0.0.1', 5001)
      }
      return functions
    }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
