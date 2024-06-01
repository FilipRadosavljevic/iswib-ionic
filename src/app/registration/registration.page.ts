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
import { AuthenticationService } from '../services/auth/authentication.service'

/*export function createPasswordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const confirmPass = control.value;
    const pass = this.password?.value;
    return pass === confirmPass ? null : { missMatch: true };
  };
}*/

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {
  credentialsForm: FormGroup

  constructor(
    private fb: FormBuilder,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private authService: AuthenticationService,
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

  ngOnInit() {
    this.credentialsForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        confirmPassword: ['', [Validators.required]],
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
    await loading.present()

    const newUser = await this.authService.register(this.credentialsForm.value)
    await loading.dismiss()

    if (newUser) {
      this.credentialsForm.reset()
      this.router.navigateByUrl('/profile', { replaceUrl: true })
    } else {
      this.showAlert('Registration failed', 'User already exists!')
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
