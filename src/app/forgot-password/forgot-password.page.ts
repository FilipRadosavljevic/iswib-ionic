import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { AuthenticationService } from '../services/auth/authentication.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  credentials: FormGroup;

  constructor(
    private authService: AuthenticationService,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private fb: FormBuilder,
    private router: Router
  ) { }

  get email() {
    return this.credentials.get('email');
  }

  ngOnInit() {
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  async resetPassword() {
    const loading = await this.loadingController.create();
    await loading.present();

    const user = await this.authService.recover(this.credentials.value);
    await loading.dismiss();

    if(user !== null) {
      this.presentToast('Password reset email sent. Check your spam folder.', 'bottom', 2500);
      this.router.navigateByUrl('', { replaceUrl: true});
    } else {
      this.presentToast('User does not exist', 'bottom', 2500);
      console.log('err');
    }
  }

  async presentToast(message, position, duration) {
    const toast = await this.toastController.create({
      message,
      duration,
      position,
      color: 'secondary',
    });
    toast.present();
  }

}
