import { Component, OnInit, inject } from '@angular/core'
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { Router } from '@angular/router'
import { LoadingController, ToastController, IonicModule } from '@ionic/angular'
import { AuthService } from '../services/auth/auth.service'

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.page.html',
    styleUrls: ['./forgot-password.page.scss'],
    imports: [IonicModule, FormsModule, ReactiveFormsModule]
})
export class ForgotPasswordPage implements OnInit {
  private authService = inject(AuthService)
  private toastController = inject(ToastController)
  private loadingController = inject(LoadingController)
  private fb = inject(UntypedFormBuilder)
  private router = inject(Router)

  credentials: UntypedFormGroup

  get email() {
    return this.credentials.get('email')
  }

  ngOnInit() {
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    })
  }

  async resetPassword() {
    const loading = await this.loadingController.create()
    await loading.present()

    const user = await this.authService.recover(this.credentials.value)
    await loading.dismiss()

    if (user !== null) {
      this.presentToast('Password reset email sent. Check your spam folder.', 'bottom', 2500)
      this.router.navigateByUrl('', { replaceUrl: true })
    } else {
      this.presentToast('User does not exist', 'bottom', 2500)
      console.log('err')
    }
  }

  async presentToast(message, position, duration) {
    const toast = await this.toastController.create({
      message,
      duration,
      position,
      color: 'light',
    })
    toast.present()
  }
}
