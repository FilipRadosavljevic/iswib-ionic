import { Component } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';

import { AlertController, AnimationController, MenuController, ToastController } from '@ionic/angular';
import { take } from 'rxjs/operators';
import { AuthenticationService } from './services/auth/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  constructor(
    private animationCtrl: AnimationController,
    private auth: Auth,
    private router: Router,
    private menu: MenuController,
    private toastController: ToastController,
    private alertController: AlertController,
    private authService: AuthenticationService
  ) {}



  myCustomPageTransition = ((baseEl: any, opts?: any) => {
      console.log('opts.enteringEl:'  + opts.enteringEl); //Entering Element - New Page
      console.log('opts.leavingEl:'  + opts.leavingEl);   //Leaving Element - Current Page
      const anim1 = this.animationCtrl.create()
        .addElement(opts.leavingEl)
        .duration(600)
        .iterations(1)
        .easing('ease-out')
        .fromTo('transform', 'translateX(0px)', 'translateX(100%)')
        .fromTo('opacity', '1', '0.2');
      let anim2 = this.animationCtrl.create()
        .addElement(opts.enteringEl)
        .duration(600)
        .iterations(1)
        .easing('ease-out')
        .fromTo('opacity', '0.0', '1');
        anim2 = this.animationCtrl.create()
        .duration(600)
        .iterations(1)
        .addAnimation([anim1, anim2]);
      return anim2;
  });

  isUserLoggedIn() {
    //console.log(this.auth.currentUser);
    return !!this.auth.currentUser;
  }

  async logout() {
    const user = this.auth.currentUser;
    this.menu.close();

    if(user) {
      await this.authService.logout();
      this.router.navigate(['']);
    } else {
      this.router.navigate(['']);
    }

  }

  deleteAccount() {
    let userId = null;
    userId = this.auth.currentUser.uid;
    this.menu.close();

    if(userId) {
      userId.delete().then(() => {
        this.router.navigate(['']);
        this.presentToast('Your account has been successfully deleted.', 'bottom', 4000);
      }).catch((error) => {
        console.log(error);
      });
    }
  }

  async presentToast(message, position, duration) {
    const toast = await this.toastController.create({
      message,
      duration,
      position,
      color: 'light',
    });
    toast.present();
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Are you sure?',
      message: 'Deleting your account cannot be undone',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => { this.menu.close();}
        },
        {
          text: 'Yes',
          role: 'confirm',
          handler: this.deleteAccount.bind(this)
        }
      ]
    });
    await alert.present();
  }
}
