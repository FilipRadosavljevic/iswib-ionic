/* eslint-disable max-len */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import { DataService } from '../../services/data.service';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit, OnDestroy {

  type: string;
  scheduleData = {};
  days: any;
  sub: Subscription;

  constructor(
    public authService: AuthenticationService,
    private dataService: DataService,
    private loadingCtrl: LoadingController,
    private router: Router) {
  }

  ngOnInit() {
    this.type = 'day0';
  }

  ngOnDestroy() {
    if(this.sub){
      this.sub.unsubscribe();
    }
  }

  async ionViewDidEnter() {
    const loadingEl = await this.loadingCtrl.create({
      message: 'Loading...',
    });
    loadingEl.present();
    await this.getData();
    loadingEl.dismiss();
  }

  segmentChanged(ev: any) {
    //console.log('Segment changed', ev);
  }

  async getData() {
    const data = await this.dataService.getSchedule();
    data.forEach(document =>{
      this.scheduleData[document.id] = Object.values(document.data());
    });
    console.log(this.scheduleData);
  }

  goToLocation(currentObject: any) {
    console.log(currentObject);
    const googleLocation = `https://www.google.com/maps/search/?api=1&query=${currentObject.location}&query_place_id=${currentObject.placeId}`;
    window.open(googleLocation);
  }

}
