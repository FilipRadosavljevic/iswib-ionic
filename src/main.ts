import { enableProdMode, importProvidersFrom, provideZoneChangeDetection } from '@angular/core'
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'

import { environment } from 'environments/environment'
import { RouteReuseStrategy } from '@angular/router'
import { IonicRouteStrategy, IonicModule } from '@ionic/angular'
import { provideFirebaseApp, initializeApp } from '@angular/fire/app'
import { Capacitor } from '@capacitor/core'
import {
  initializeAuth,
  indexedDBLocalPersistence,
  provideAuth,
  getAuth,
  connectAuthEmulator,
} from '@angular/fire/auth'
import { provideFirestore, getFirestore, connectFirestoreEmulator } from '@angular/fire/firestore'
import { provideStorage, getStorage, connectStorageEmulator } from '@angular/fire/storage'
import { provideFunctions, getFunctions, connectFunctionsEmulator } from '@angular/fire/functions'
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser'
import { AppRoutingModule } from './app/app-routing.module'
import { AppComponent } from './app/app.component'

if (environment.production) {
  enableProdMode()
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection(),
    importProvidersFrom(BrowserModule, IonicModule.forRoot(), AppRoutingModule),
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
    provideHttpClient(withInterceptorsFromDi()),
  ],
}).catch((err) => console.log(err))
