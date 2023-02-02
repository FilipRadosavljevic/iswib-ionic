import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit, OnDestroy {

  data: any = [];
  sub: Subscription;

  constructor(
    private loadingCtrl: LoadingController,
    private dataService: DataService
    ) {}

  ngOnInit() {
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

  async getData() {
    const workshopData = await this.dataService.getWorkshops();
    workshopData.forEach(document => {
      this.data.push(document.data());
    });
  }

}
