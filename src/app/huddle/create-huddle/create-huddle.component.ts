import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Huddle } from 'src/app/models/huddle.model';

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
    const offset = (new Date()).getTimezoneOffset() * 60000;
    const timeInit = new Date(this.timeConstraints.timeFrom.getTime() - offset).toISOString();
    this.form = new FormGroup({
      title: new FormControl(this.huddle? this.huddle.title : null,
      {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      description: new FormControl(this.huddle? this.huddle.description : null,
      {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      }),
      time: new FormControl(this.huddle? this.huddle.time : timeInit,
      {
        updateOn: 'change'
      })
    });
  }

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel', 'huddleModal');
  }

  onSubmit() {
    if(!this.form.valid || !this.timesValid()){
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
    const offset = (new Date()).getTimezoneOffset() * 60000;
    const timeFrom = new Date(this.timeConstraints.timeFrom.getTime() - offset);
    const timeTo = new Date(this.timeConstraints.timeTo.getTime() - offset);
    const time = new Date(this.form.value.time);
    return time >= timeFrom && time < timeTo;
  }
}
