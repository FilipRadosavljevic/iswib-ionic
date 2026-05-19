import { Injectable, inject } from '@angular/core'
import { ToastButton, ToastController } from '@ionic/angular'

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastController = inject(ToastController);


  async presentToast(
    message: string,
    duration: number = 2000,
    position: 'top' | 'middle' | 'bottom' = 'bottom',
    buttons?: ToastButton[],
    cssClass?: string | string[],
  ) {
    const toast = await this.toastController.create({
      message,
      duration,
      position,
      color: 'secondary',
      buttons: buttons ?? [
        {
          role: 'cancel',
          icon: 'close',
        },
      ],
      cssClass,
    })

    await toast.present()
  }
}
