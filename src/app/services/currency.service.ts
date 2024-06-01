/* eslint-disable no-underscore-dangle */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { getDatabase, ref, set, get } from '@angular/fire/database';
import { BehaviorSubject } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

export interface Currency {
  name: string;
  code: string;
  rate: number;
}

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  currencies: Currency[];

  constructor(
    private http: HttpClient
    ) { }

  async fetchCurrencies() {
    try{
      const data = await get(ref(getDatabase(),'/Currencies'));
      if(data){
        this.currencies = data.val();
      }
      else{
        console.error('No available rates data.');
      }
    } catch(error){
      console.error(error);
    }
  }

  dowloadNewRates() {
    let currencies: Currency[];
    this.http.get<any>('https://api.apilayer.com/exchangerates_data/symbols',
    { headers: { apikey: environment.currencyAPI} })
    .pipe(
      switchMap(resData => {
        //let currencies: Currency[];
        console.log(resData);
        for (const key in resData.symbols) {
          if (resData.symbols.hasOwnProperty(key)) {
            console.log(typeof currencies);
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
      tap(resData=>{
        console.log(resData);
        for (const key in resData.rates) {
          if (resData.rates.hasOwnProperty(key)) {
            const curr = currencies.find((value)=>value.code===key);
            curr.rate = resData.rates[key];
          }
        }
        this.currencies = currencies;
        set(ref(getDatabase(), '/Currencies'), currencies);
      }),
    ).subscribe();
  }

}
