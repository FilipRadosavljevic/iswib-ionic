import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Preferences } from '@capacitor/preferences';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Platform } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { Auth } from '@angular/fire/auth';
import { getDatabase, ref, update } from '@angular/fire/database';

export interface UserPhoto {
  filepath: string;
  webviewPath: string;
  data?: string;
  name?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  profilePic: UserPhoto;
  private storageKey = 'photos';

  constructor(
    private platform: Platform,
    private auth: Auth
  ) { }

  async addNewProfilePic() {
    const capturedPhoto = await Camera.getPhoto({
      quality: 80,
      source: CameraSource.Prompt,
      correctOrientation: true,
      allowEditing: false,
      resultType: CameraResultType.Uri
    });

    const savedImageFile = await this.savePicture(capturedPhoto);
    this.profilePic = savedImageFile;

    Preferences.set({
      key: this.storageKey + `/${this.auth.currentUser.uid}`,
      value: JSON.stringify(this.profilePic),
    });
    return savedImageFile;
  }

  async loadSaved() {
    const photo = await Preferences.get({
      key: this.storageKey + `/${this.auth.currentUser.uid}`
    });
    this.profilePic = JSON.parse(photo.value) || null;
    if(!this.platform.is('hybrid') && this.profilePic) {
      const readFile = await Filesystem.readFile({
        path: this.profilePic.filepath,
        directory: Directory.Data,
      });
      this.profilePic.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
    }
  }

  private async savePicture(photo: Photo) {
    const base64Data = await this.readAsBase64(photo);

    //const fileName = new Date().getTime() + '.jpeg';
    const fileName = this.auth.currentUser.uid + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data
    });

    await update(ref(getDatabase(), `users/${this.auth.currentUser.uid}`), {
      profilePic: Capacitor.convertFileSrc(savedFile.uri)
    });

    if(this.platform.is('hybrid')) {
      return {
        filepath: savedFile.uri,
        webviewPath: Capacitor.convertFileSrc(savedFile.uri),
        name: fileName,
        data: base64Data
      };
    } else {
      return {
        filepath: fileName,
        webviewPath: photo.webPath,
        name: fileName,
        data: base64Data
      };
    }
  }

  private async readAsBase64(photo: Photo) {
    if(this.platform.is('hybrid')) {
      const file = await Filesystem.readFile({
        path: photo.path
      });
      return file.data;
    }
    else {
      const response = await fetch(photo.webPath);
      const blob = await response.blob();
      return await this.convertBlobToBase64(blob) as string;
    }
  }

  private convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });
}
