import { Component, OnInit, OnDestroy } from '@angular/core'
import { Subject, Subscription } from 'rxjs'
import { DataService } from 'src/app/services/data.service'
import { takeUntil } from 'rxjs/operators'
import { Sponsor } from './models/sponsor.model'

@Component({
  selector: 'app-sponsors',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page implements OnInit, OnDestroy {
  sponsors: Sponsor[] = []

  ngUnsubscribe = new Subject<void>()

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService
      .getSponsors()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((sponsors) => {
        this.sponsors = [...sponsors]
      })
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next()
    this.ngUnsubscribe.complete()
  }
}
