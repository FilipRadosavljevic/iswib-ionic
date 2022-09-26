import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ModalController, LoadingController, IonModal } from '@ionic/angular';
import { Currency, CurrencyService } from '../services/currency.service';

@Component({
  selector: 'app-converter',
  templateUrl: './converter.page.html',
  styleUrls: ['./converter.page.scss'],
})
export class ConverterPage implements OnInit {
  @ViewChild('fromModal') fromModal: IonModal;
  @ViewChild('toModal') toModal: IonModal;
  @ViewChild('fromValueRef') fromValueRef: ElementRef<HTMLInputElement>;
  @ViewChild('toValueRef') toValueRef: ElementRef<HTMLInputElement>;
  countryRates = new Map<string, number>();
  countryNames = new Map<string, string>();
  currencies: Currency[];
  searchResults: Currency[];
  isLoading = false;

  fromValue: number;
  toValue: number;

  fromCurr = 'RSD';
  toCurr = 'EUR';

  constructor(
    private currencyService: CurrencyService,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController
  ) { }

  async ngOnInit() {
    console.log('onInit');
    await this.currencyService.fetchCurrencies();
    this.currencies = await this.currencyService.fetchCurrencies();
    console.log(this.currencies);

    this.searchResults = [...this.currencies];
    this.populateMaps();
  }

  onSearch(event: any) {
    const query = event.target.value.toLowerCase();
    this.searchResults = this.currencies.filter(curr => curr.code.toLowerCase().indexOf(query) > -1
      || curr.name.toLowerCase().indexOf(query) > -1);
  }

  getNewRates() {
    this.currencyService.dowloadNewRates();
  }

  calculateFromValue() {
    this.fromValue = +(this.toValue
                        / this.countryRates[this.toCurr]
                         * this.countryRates[this.fromCurr]).toFixed(2);
  }

  calculateToValue() {
    this.toValue = +(this.fromValue
                        / this.countryRates[this.fromCurr]
                         * this.countryRates[this.toCurr]).toFixed(2);
  }

  populateMaps() {
    for (const curr of this.currencies){
      this.countryNames[curr.code] = curr.name;
      this.countryRates[curr.code] = curr.rate;
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
  }

  onChooseTo(code: string){
    this.toCurr = code;
    this.calculateFromValue();
    this.toModal.dismiss();
  }

  onCancel() {
    this.fromModal.dismiss();
    this.toModal.dismiss();
  }

  onConfirm() {
    this.fromModal.dismiss();
    this.toModal.dismiss();
  }
}
