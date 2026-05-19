import { Component, OnInit, OnDestroy, inject } from '@angular/core'
import { Subject, Subscription } from 'rxjs'
import { DataService } from 'src/app/services/data.service'
import { Workshop } from './models/workshop.model'
import { takeUntil } from 'rxjs/operators'
import { HeaderComponent } from '../../components/header/header.component'
import { IonicModule } from '@ionic/angular'
import { NgClass, TitleCasePipe } from '@angular/common'

@Component({
  selector: 'app-workshops',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [HeaderComponent, IonicModule, NgClass, TitleCasePipe],
})
export class Tab2Page implements OnInit, OnDestroy {
  private dataService = inject(DataService)

  workshops: Workshop[] = []

  ngUnsubscribe = new Subject<void>()

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
