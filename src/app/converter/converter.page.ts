import { Component, OnInit, ViewChild } from '@angular/core';
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
  countryRates = new Map<string, number>();
  countryNames = new Map<string, string>();
  currencies: Currency[];
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
    await this.currencyService.fetchCurrencies();
    this.currencies = this.currencyService.currencies;
    this.populateMaps();
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
