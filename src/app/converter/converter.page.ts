import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ModalController, LoadingController, IonModal } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Currency, CurrencyService } from '../services/currency.service';

@Component({
  selector: 'app-converter',
  templateUrl: './converter.page.html',
  styleUrls: ['./converter.page.scss'],
})
export class ConverterPage implements OnInit, OnDestroy {
  @ViewChild('fromModal') fromModal: IonModal;
  @ViewChild('toModal') toModal: IonModal;
  @ViewChild('fromValueRef') fromValueRef: ElementRef<HTMLInputElement>;
  @ViewChild('toValueRef') toValueRef: ElementRef<HTMLInputElement>;
  countryRates = new Map<string, number>();
  countryNames = new Map<string, string>();
  currencies: Currency[];
  searchResults: Currency[];
  isLoading = false;
  currSub: Subscription;

  fromValue: number;
  toValue: number;

  fromCurr = 'RSD';
  toCurr = 'EUR';

  constructor(
    private currencyService: CurrencyService,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController
  ) { }

  ngOnDestroy(): void {
    if(this.currSub) {
      this.currSub.unsubscribe();
    }
  }

  async ngOnInit() {
    console.log(this.fromValue);
    console.log('onInit');
    this.currSub = this.currencyService.currencies
    .subscribe(currencies => {
      this.currencies = currencies;
      this.searchResults = [...currencies];
      this.populateMaps();
    });
  }

  async ionViewWillEnter() {
    const loadingEl = await this.loadingCtrl.create({
      message: 'Loading Rates...',
    });
    loadingEl.present();
    await this.currencyService.fetchCurrencies();
    loadingEl.dismiss();
  }

  populateMaps() {
    for (const curr of this.currencies){
      this.countryNames[curr.code] = curr.name;
      this.countryRates[curr.code] = curr.rate;
    }

  }

  onSearch(event: any) {
    const query = event.target.value.toLowerCase();
    this.searchResults = this.currencies.filter(curr => curr.code.toLowerCase().indexOf(query) > -1
      || curr.name.toLowerCase().indexOf(query) > -1);
  }

  async getNewRates() {
    const loadingEl = await this.loadingCtrl.create({
      message: 'Fetching Latest Rates...',
    });
    loadingEl.present();
    this.currencyService.dowloadNewRates()
    .subscribe(_ => {
      loadingEl.dismiss();
    });
  }

  calculateFromValue() {
    const val = +(this.toValue
      / this.countryRates[this.toCurr]
        * this.countryRates[this.fromCurr]).toFixed(2);
    if(!val){
      this.fromValue = undefined;
    } else {
      this.fromValue = val;
    }
  }

  calculateToValue() {
    const val = +(this.fromValue
      / this.countryRates[this.fromCurr]
        * this.countryRates[this.toCurr]).toFixed(2);
    if(!val) {
      this.toValue = undefined;
    } else {
      this.toValue = val;
    }
  }

  onSwitch() {
    const tmpCurr = this.fromCurr;
    this.fromCurr = this.toCurr;
    this.toCurr = tmpCurr;

    const tmpVal = this.fromValue;
    this.fromValue = this.toValue;
    this.toValue = tmpVal;
  }

  onChooseFrom(code: string){
    this.fromCurr = code;
    this.calculateToValue();
    this.fromModal.dismiss();
    this.searchResults = [...this.currencies];
  }

  onChooseTo(code: string){
    this.toCurr = code;
    this.calculateFromValue();
    this.toModal.dismiss();
    this.searchResults = [...this.currencies];
  }

  onCancel(modal: IonModal) {
    modal.dismiss();
    this.searchResults = [...this.currencies];
  }
}
