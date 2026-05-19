import { Component, OnInit, OnDestroy, inject } from '@angular/core'
import { Subject } from 'rxjs'
import { DataService } from '../../services/data.service'
import { ScheduleDay } from './models/schedule-day.model'
import { takeUntil } from 'rxjs/operators'
import { HeaderComponent } from '../../components/header/header.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { NgStyle } from '@angular/common';
@Component({
    selector: 'app-schedule',
    templateUrl: 'tab1.page.html',
    styleUrls: ['tab1.page.scss'],
    imports: [HeaderComponent, IonicModule, FormsModule, NgStyle]
})
export class Tab1Page implements OnInit, OnDestroy {
  private dataService = inject(DataService);

  type: string

  days: ScheduleDay[]

  ngUnsubscribe = new Subject<void>()

  ngOnInit() {
    this.type = 'day0'

    this.dataService
      .getSchedule()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((scheduleDays) => {
        console.log(scheduleDays)
        this.days = [...scheduleDays]
      })
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next()
    this.ngUnsubscribe.complete()
  }

  goToLocation(location: string, placeId: string) {
    // eslint-disable-next-line max-len
    const googleLocation = `https://www.google.com/maps/search/?api=1&query=${location}&query_place_id=${placeId}`
    window.open(googleLocation)
  }
}
