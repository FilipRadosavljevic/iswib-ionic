import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page implements OnInit, OnDestroy {
  data: any;
  sub: Subscription;

  constructor(private dataService: DataService) {}

  ngOnInit() {}

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  ionViewDidEnter() {
    this.getData();
  }

  async getData() {
    this.sub = await this.dataService.getWorkshops().subscribe((res) => {
      this.data = res;
      console.log(1);
    });
  }
}
