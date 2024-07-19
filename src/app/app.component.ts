import { Component, OnDestroy, OnInit } from '@angular/core'
import { Router } from '@angular/router'

import {
  AlertController,
  AnimationController,
  MenuController,
  ToastController,
} from '@ionic/angular'
import { takeUntil } from 'rxjs/operators'
import { AuthService } from './services/auth/auth.service'
import { Observable, Subject } from 'rxjs'
import { User } from './models/user.model'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private _unsubscribe$ = new Subject<void>()

  constructor(
    private animationCtrl: AnimationController,
    private router: Router,
    private menu: MenuController,
    private toastController: ToastController,
    private alertController: AlertController,
    public authService: AuthService,
  ) {}

  user: User | null

  ngOnInit() {
    this.authService.user.pipe(takeUntil(this._unsubscribe$)).subscribe((user) => {
      this.user = user
    })
  }

  ngOnDestroy() {
    this._unsubscribe$.next()
    this._unsubscribe$.complete()
  }

  myCustomPageTransition = (_baseEl: any, opts?: any) => {
    const anim1 = this.animationCtrl
      .create()
      .addElement(opts.leavingEl)
      .duration(600)
      .iterations(1)
      .easing('ease-out')
      .fromTo('transform', 'translateX(0px)', 'translateX(100%)')
      .fromTo('opacity', '1', '0.2')
    let anim2 = this.animationCtrl
      .create()
      .addElement(opts.enteringEl)
      .duration(600)
      .iterations(1)
      .easing('ease-out')
      .fromTo('opacity', '0.0', '1')
    anim2 = this.animationCtrl.create().duration(600).iterations(1).addAnimation([anim1, anim2])
    return anim2
  }

  async logout() {
    this.menu.close()

    await this.authService.logout()

    this.router.navigate(['/'])
  }

  async deleteAccount() {
    await this.menu.close()

    this.router.navigate([''])
    this.presentToast('Your account has been successfully deleted.', 'bottom', 4000)
  }

  async presentToast(message: string, position: 'top' | 'bottom' | 'middle', duration: number) {
    const toast = await this.toastController.create({
      message,
      duration,
      position,
      color: 'light',
    })
    toast.present()
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Are you sure?',
      message: 'Deleting your account cannot be undone',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            this.menu.close()
          },
        },
        {
          text: 'Yes',
          role: 'confirm',
          handler: this.deleteAccount.bind(this),
        },
      ],
    })
    await alert.present()
  }
}
