import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Huddle } from '../models/huddle.model';
import { HuddleService } from '../services/huddle.service';
import { CreateHuddleComponent } from './create-huddle/create-huddle.component';

@Component({
  selector: 'app-huddle',
  templateUrl: './huddle.page.html',
  styleUrls: ['./huddle.page.scss'],
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class HuddlePage implements OnInit, OnDestroy {
  huddles: Huddle[];
  huddlesSub: Subscription;
  huddleDay: number;
  times: {
    timeFrom: Date;
    timeTo: Date;
  };

  constructor(
    private cd: ChangeDetectorRef,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
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
      console.log(this.huddleDay);
      console.log(huddles);
      const newHuddles = [];
      huddles.forEach(h => {
        newHuddles.push(h);
      });
      this.huddles = [...newHuddles];
      //this.cd.markForCheck();
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

  async ionViewWillEnter() {
    console.log(this.huddleDay);
    console.log(this.huddles);
    try{
      this.times = await this.huddleService.fetchHuddlesByDay(this.huddleDay);
      console.log(this.times);
    } catch(error) {
      console.log(error);
      const alert = await this.alertCtrl.create({
        header: 'An error occured',
        message: 'Could not load huddle',
        buttons: [
          {
            text: 'Okay',
            handler: () => {
              this.router.navigateByUrl('/tabs/tab1', {replaceUrl: true});
            }
          }
        ]
      });
      await alert.present();
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
          this.huddleService.updateHuddle(
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
    this.huddleService.updateHuddleUsers(
      this.huddleDay,
      huddleID,
      this.auth.currentUser.uid,
      index,
      'leave'
    ).subscribe();
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
            []
          ).subscribe(() => {
            loadingEl.dismiss();
          });
        });
      }
    });
  }

}
