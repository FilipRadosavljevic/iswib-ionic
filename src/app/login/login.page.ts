import { Component, OnInit, inject } from '@angular/core'
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { Router, RouterLink } from '@angular/router'
import { AlertController, LoadingController, ToastController, IonicModule } from '@ionic/angular'
import { AuthService } from '../services/auth/auth.service'
import { FirebaseError } from '@angular/fire/app'

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
    imports: [IonicModule, FormsModule, ReactiveFormsModule, RouterLink]
})
export class LoginPage implements OnInit {
  private fb = inject(UntypedFormBuilder);
  private loadingController = inject(LoadingController);
  private alertController = inject(AlertController);
  private authService = inject(AuthService);
  private router = inject(Router);

  credentialsForm: UntypedFormGroup

  // Easy access for form fields
  get email() {
    return this.credentialsForm.get('email')
  }

  get password() {
    return this.credentialsForm.get('password')
  }

  ngOnInit() {
    this.credentialsForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    })
  }

  async login() {
    const loading = await this.loadingController.create()

    try {
      await loading.present()

      await this.authService.login(
        this.credentialsForm.value.email,
        this.credentialsForm.value.password,
      )

      this.router.navigateByUrl('tabs', { replaceUrl: true })
    } catch (e) {
      const error = e as FirebaseError

      const code = error.code

      switch (code) {
        case 'auth/invalid-email':
          this.showAlert('Login failed', 'Email is not valid!')
          break
        case 'auth/user-disabled':
          this.showAlert('Login failed', 'Your request has not been approved yet!')
          break
        case 'auth/user-not-found':
          this.showAlert('Login failed', 'There is no user corresponding to this email!')
          break
        case 'auth/wrong-password':
          this.showAlert('Login failed', 'Wrong password!')
          break
        default:
          this.showAlert('Login failed', 'An error occurred!')
          break
      }
    } finally {
      this.credentialsForm.reset()
      await loading.dismiss()
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      cssClass: 'custom-alert',
      buttons: ['OK'],
    })
    await alert.present()
  }
}
