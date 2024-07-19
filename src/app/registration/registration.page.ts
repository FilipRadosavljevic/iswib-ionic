import { Component, OnInit } from '@angular/core'
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms'
import { Router } from '@angular/router'
import { AlertController, LoadingController } from '@ionic/angular'
import { AuthService } from '../services/auth/auth.service'
import { ToastService } from '../services/toast.service'

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {
  credentialsForm: FormGroup

  roles: { value: string; label: string }[] = [
    { value: 'ORG', label: 'Org Team' },
    { value: 'GG', label: 'Group Guide' },
    { value: 'INFO', label: 'Info & Host' },
    { value: 'LOG', label: 'Logistics' },
    { value: 'MEDIA', label: 'Media' },
    { value: 'PARTICIPANT', label: 'Participant' },
  ]

  constructor(
    private fb: FormBuilder,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router,
  ) {}

  // Easy access for form fields
  get email() {
    return this.credentialsForm.get('email')
  }

  get password() {
    return this.credentialsForm.get('password')
  }

  get firstName() {
    return this.credentialsForm.get('firstName')
  }

  get lastName() {
    return this.credentialsForm.get('lastName')
  }

  get confirmPassword() {
    return this.credentialsForm.get('confirmPassword')
  }

  get role() {
    return this.credentialsForm.get('role')
  }

  ngOnInit() {
    this.credentialsForm = this.fb.group(
      {
        email: ['', [Validators.required]],
        password: ['', [Validators.required]],
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        confirmPassword: ['', [Validators.required]],
        role: ['', [Validators.required]],
      },
      {
        validators: [this.createPasswordValidator()],
      },
    )
  }

  createPasswordValidator(): ValidatorFn {
    return (controlGroup: AbstractControl): ValidationErrors | null => {
      const confirmPass = controlGroup.get('confirmPassword').value
      const pass = controlGroup.get('password').value
      return pass === confirmPass ? null : { missMatch: true }
    }
  }

  async register() {
    const loading = await this.loadingController.create()

    try {
      await loading.present()

      await this.authService.createUserRequest(this.credentialsForm.value)

      this.credentialsForm.reset()
      await this.router.navigateByUrl('', { replaceUrl: true })
      this.toastService.presentToast('Your request has been sent for approval!', 3000)
    } catch (error) {
      console.log(error)

      switch (error) {
        case 'EMAIL_NOT_FOUND':
          this.showAlert('Login failed', 'Email not found!')
          break
        case 'INVALID_PASSWORD':
          this.showAlert('Login failed', 'Wrong password!')
          break
        default:
          this.showAlert('Login failed', 'An error occurred!')
          break
      }
    } finally {
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
