import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, AlertController, LoadingController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Huddle } from '../models/huddle.model';
import { HuddleService } from '../services/huddle.service';
import { CreateHuddleComponent } from './create-huddle/create-huddle.component';

@Component({
  selector: 'app-huddle',
  templateUrl: './huddle.page.html',
  styleUrls: ['./huddle.page.scss'],
})
export class HuddlePage implements OnInit, OnDestroy {
  isLoading = false;
  huddles: Huddle[];
  huddlesSub: Subscription;
  huddleDay: number;
  times: {
    timeFrom: Date;
    timeTo: Date;
  };

  constructor(
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private actionSheetCtrl: ActionSheetController,
    private huddleService: HuddleService,
    private route: ActivatedRoute,
    private router: Router,
    public auth: Auth,
  ) { }

  ngOnDestroy() {
      if(this.huddlesSub) {
        this.huddlesSub.unsubscribe();
      }
  }

  ngOnInit() {
    this.huddlesSub = this.huddleService.huddles.subscribe(huddles => {
      this.huddles =huddles;
    });
    this.route.paramMap.subscribe(paramMap => {
      if(!paramMap.has('huddleDay')){
        console.log('No huddleDay found');
        this.router.navigateByUrl('/tabs/tab1', {replaceUrl: true});
        return;
      }
      this.huddleDay =  +paramMap.get('huddleDay');
      console.log(this.huddleDay);
      console.log(this.huddles);
    });
  }

  async presentSortActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Sort By',
      buttons: [
        {
          text: 'Ascending',
          handler: () => {
            this.sort('ASC');
          }
        },
        {
          text: 'Descending',
          handler: () => {
            this.sort('DESC');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
        }
      ],
    });
    await actionSheet.present();
  }

  sort(order: 'ASC' | 'DESC') {
    this.huddles.sort((a, b) => {
      const offset = new Date().getTimezoneOffset() * 60000;
      const aMilli = new Date(a.time).getTime() - offset;
      const bMilli = new Date(b.time).getTime() - offset;
      return order === 'ASC' ? aMilli - bMilli : bMilli - aMilli;
    });
  }

  async ionViewWillEnter() {
    this.isLoading = true;
    console.log(this.huddleDay);
    console.log(this.huddles);

    try{
      await this.huddleService.fetchAllHuddles();
      this.sort('DESC');
      this.isLoading = false;
    } catch(error) {
      this.isLoading = false;
      //loadingEl.dismiss();
      console.log(error);
      const alert = await this.alertCtrl.create({
        header: 'An error occured',
        message: 'Could not load huddle',
        buttons: [
          {
            text: 'Okay',
            handler: () => {
              //this.router.navigateByUrl('/tabs/tab1', {replaceUrl: true});
            }
          }
        ]
      });
      //await alert.present();
    }
  }

  hasJoined(index: number) {
    return this.huddles[index].userIDs.includes(this.auth.currentUser.uid);
  }

  onEditHuddle(huddleID: string, index: number) {
    this.modalCtrl
    .create(
      {
        component: CreateHuddleComponent,
        id: 'huddleModal',
        componentProps: {
          timeConstraints: this.times,
          huddle: this.huddles[index]
        },
      }
    )
    .then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    })
    .then(resultsData => {
      if(resultsData.role === 'confirm'){
        this.loadingCtrl.create({
          message: 'Saving changes...'
        }).then(loadingEl => {
          loadingEl.present();
          const data = resultsData.data.huddleData;
          this.huddleService.editHuddle(
            index,
            huddleID,
            this.huddleDay,
            data.time.toISOString(),
            data.title,
            data.description,
          ).subscribe(() => {
            loadingEl.dismiss();
          });
        });
      }
    });
  }

  onJoinHuddle(huddleID: string, index: number) {
    this.huddleService.updateHuddleUsers(
      this.huddleDay,
      huddleID,
      this.auth.currentUser.uid,
      index,
      'join'
    ).subscribe();
  }

  onLeaveHuddle(huddleID: string, index: number) {
    if(this.huddles[index].userIDs.length === 1){
      this.huddleService.deleteHuddle(
        index,
        huddleID,
        this.huddleDay
      ).subscribe();
    } else {
      this.huddleService.updateHuddleUsers(
        this.huddleDay,
        huddleID,
        this.auth.currentUser.uid,
        index,
        'leave'
      ).subscribe();
    }
  }

  openCreateHuddle() {
    this.modalCtrl
    .create(
      {
        component: CreateHuddleComponent,
        id: 'huddleModal',
        componentProps: {
          timeConstraints: this.times
        },
      }
    )
    .then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    })
    .then(resultsData => {
      if(resultsData.role === 'confirm'){
        this.loadingCtrl.create({
          message: 'Creating huddle...'
        }).then(loadingEl => {
          loadingEl.present();
          const data = resultsData.data.huddleData;
          this.huddleService.addHuddle(
            this.huddleDay,
            this.auth.currentUser.uid,
            data.time.toISOString(),
            data.title,
            data.description,
            [this.auth.currentUser.uid]
          ).subscribe(() => {
            loadingEl.dismiss();
          });
        });
      }
    });
  }

}
