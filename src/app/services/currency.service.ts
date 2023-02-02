/* eslint-disable no-underscore-dangle */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map, switchMap, tap } from 'rxjs/operators';
import { writeBatch, doc, Firestore, getDocs, collection } from '@angular/fire/firestore';
import { BehaviorSubject, from } from 'rxjs';
import { DataService } from './data.service';

export interface Currency {
  name: string;
  code: string;
  rate: number;
}

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private _currencies = new BehaviorSubject<Currency[]>([]);

  constructor(
    private dataService: DataService,
    private http: HttpClient,
    private firestore: Firestore
    ) { }

    get currencies() {
      return this._currencies.asObservable();
    }

  async fetchCurrencies() {
    const currencies = await this.dataService.getCurrencies();
    this._currencies.next(currencies);
  }

  dowloadNewRates() {
    const currencies: Currency[] = [];
    return this.http.get<any>('https://api.apilayer.com/exchangerates_data/symbols',
    { headers: { apikey: environment.currencyAPI} })
    .pipe(
      switchMap(resData => {
        for (const key in resData.symbols) {
          if (resData.symbols.hasOwnProperty(key)) {
            currencies.push(
              {
                code: key,
                name: resData.symbols[key],
                rate: null
              }
            );
          }
        }
        return this.http.get<any>('https://api.apilayer.com/exchangerates_data/latest',
        { headers: { apikey: environment.currencyAPI} });
      }),
      switchMap(resData => {
        const batch = writeBatch(this.firestore);
        for (const key in resData.rates) {
          if (resData.rates.hasOwnProperty(key)) {
            const curr = currencies.find(value => value.code===key);
            curr.rate = resData.rates[key];
            batch.set(doc(this.firestore,'currencies', curr.code), curr);
          }
        }
        this._currencies.next(currencies);
        return from(batch.commit());
      }),
    );
  }
}
