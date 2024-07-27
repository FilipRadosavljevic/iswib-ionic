import { Component, OnInit, OnDestroy } from '@angular/core'
import { Subject, Subscription } from 'rxjs'
import { DataService } from 'src/app/services/data.service'
import { Workshop } from './models/workshop.model'
import { takeUntil } from 'rxjs/operators'

@Component({
  selector: 'app-workshops',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page implements OnInit, OnDestroy {
  workshops: Workshop[] = []

  ngUnsubscribe = new Subject<void>()

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService
      .getWorkshops()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((workshops) => {
        this.workshops = [...workshops]
      })
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next()
    this.ngUnsubscribe.complete()
  }
}
