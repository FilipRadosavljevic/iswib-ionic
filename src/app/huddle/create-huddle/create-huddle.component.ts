import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Huddle } from 'src/app/models/huddle.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-create-huddle',
  templateUrl: './create-huddle.component.html',
  styleUrls: ['./create-huddle.component.scss'],
})

export class CreateHuddleComponent implements OnInit {
  @Input() huddle: Huddle;
  @Input() timeConstraints: {
    timeFrom: Date;
    timeTo: Date;
  };
  form: FormGroup;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    //const offset = (new Date()).getTimezoneOffset() * 60000;
    //const timeInit = new Date(this.timeConstraints.timeFrom.getTime() - offset).toISOString();
    this.form = new FormGroup({
      title: new FormControl(this.huddle? this.huddle.title : null,
      {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      description: new FormControl(this.huddle? this.huddle.description : null,
      {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      }),
      time: new FormControl(null,
      {
        updateOn: 'change'
      })
    });
  }

  async initMap() {
    const googleMaps = await this.loadGoogleMaps();
    // const map = new googleMaps.Map(document.getElementById('map') as HTMLElement, {
    //   center: {lat: -34.397, lng: 150.644},
    //   zoom: 8,
    //   mapId: 'dc7d74307714b0ab'
    // });

    // map.addListener('click', (mapsEventData: any) => {
    //   console.log(mapsEventData.latLng);
    // });
  }

  loadGoogleMaps(): Promise<any> {
    const win = window as any;
    const gModule = win.google;
    if(gModule && gModule.maps) {
     return Promise.resolve(gModule.maps);
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src =
        'https://maps.googleapis.com/maps/api/js?key=' +
        environment.mapsAPI +
        '&callback=initMap';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = () => {
        const loadedGoogleModule = win.google;
        if(loadedGoogleModule && loadedGoogleModule.maps) {
          resolve(loadedGoogleModule.maps);
        } else {
          reject('Google Map SDK is not Available');
        }
      };
    });
  }

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel', 'huddleModal');
  }

  submitForm() {
    if(!this.form.valid){
      return;
    }

    this.modalCtrl.dismiss({
      huddleData: {
        title: this.form.value.title,
        description: this.form.value.description,
        time: new Date(this.form.value.time),
      }
    },
     'confirm', 'huddleModal');
  }

  timesValid() {
    //const offset = (new Date()).getTimezoneOffset() * 60000;
    //const timeFrom = new Date(this.timeConstraints.timeFrom.getTime() - offset);
    //const timeTo = new Date(this.timeConstraints.timeTo.getTime() - offset);
    const now = new Date();
    const time = new Date(this.form.value.time);
    return time >= now;
  }
}
