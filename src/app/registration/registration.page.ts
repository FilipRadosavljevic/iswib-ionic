import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthenticationService } from '../services/auth/authentication.service';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {

  credentials: FormGroup;

  constructor(
    private fb: FormBuilder,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private authService: AuthenticationService,
    private router: Router,
    private user: UsersService
  ) {}

  get email() {
    return this.credentials.get('email');
  }

  get password() {
    return this.credentials.get('password');
  }

  // get firstName() {
  //   return this.credentials.get('name');
  // }

  // get secondName() {
  //   return this.credentials.get('surname');
  // }

  ngOnInit() {
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }


  async register() {
    const loading = await this.loadingController.create();
    await loading.present();

    const newUser = await this.authService.register(this.credentials.value);
    await loading.dismiss();

    if (newUser) {
      this.user.setUser({
        email: this.email.value,
        userID: newUser.user.uid
      });
      this.user.setUserToDB(this.email.value, newUser.user.uid);
      this.router.navigateByUrl('/tabs', { replaceUrl: true });
    } else {
      this.showAlert('Registration failed', 'Please try again!');
    }
  }

  async showAlert(header, message) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
