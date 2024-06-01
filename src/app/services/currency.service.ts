/* eslint-disable no-underscore-dangle */
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from 'src/environments/environment'
import { switchMap, tap } from 'rxjs/operators'
import { writeBatch, doc, Firestore, getDocs, collection } from '@angular/fire/firestore'

export interface Currency {
  name: string
  code: string
  rate: number
}

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  currencies: Currency[]

  constructor(
    private http: HttpClient,
    private firestore: Firestore,
  ) {}

  async fetchCurrencies() {
    try {
      const dataSnapshot = await getDocs(collection(this.firestore, 'currencies'))
      const currencies: Currency[] = []
      dataSnapshot.forEach((document) => {
        //console.log(document.data());
        currencies.push(document.data() as Currency)
      })
      return currencies
    } catch (error) {
      console.error(error)
      return []
    }
  }

  // downloadNewRates() {
  //   const currencies: Currency[] = [];
  //   this.http.get<any>('https://api.apilayer.com/exchangerates_data/symbols',
  //   { headers: { apikey: environment.currencyAPI} })
  //   .pipe(
  //     switchMap(resData => {
  //       //let currencies: Currency[];
  //       console.log(resData);
  //       for (const key in resData.symbols) {
  //         if (resData.symbols.hasOwnProperty(key)) {
  //           console.log(typeof currencies);
  //           currencies.push(
  //             {
  //               code: key,
  //               name: resData.symbols[key],
  //               rate: null
  //             }
  //           );
  //         }
  //       }
  //       return this.http.get<any>('https://api.apilayer.com/exchangerates_data/latest',
  //       { headers: { apikey: environment.currencyAPI} });
  //     }),
  //     tap(async resData=>{
  //       const batch = writeBatch(this.firestore);
  //       console.log(resData);
  //       for (const key in resData.rates) {
  //         if (resData.rates.hasOwnProperty(key)) {
  //           const curr = currencies.find((value)=>value.code===key);
  //           curr.rate = resData.rates[key];
  //           batch.set(doc(this.firestore,'currencies',curr.code),curr);
  //         }
  //       }
  //       this.currencies = currencies;
  //       await batch.commit();
  //     }),
  //   ).subscribe();
  // }
}
