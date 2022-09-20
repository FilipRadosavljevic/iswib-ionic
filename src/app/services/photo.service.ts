import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Preferences } from '@capacitor/preferences';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Platform } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, doc, updateDoc } from '@angular/fire/firestore';

export interface UserPhoto {
  filepath: string;
  webviewPath: string;
}

export interface UserPhotoData {
  filepathNative: string;
  webviewPathNative: string;
  filepathWeb: string;
  webviewPathWeb: string;
}

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  private storageKey = 'photos';

  constructor(
    private platform: Platform,
    private auth: Auth,
    private firestore: Firestore
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
    return savedImageFile;
  }

  async loadSaved(profilePicString: string) {

    console.log(profilePicString);
    if(profilePicString === 'default'){
      return  {
        filepathNative: 'assets/images/swibi.png',
        webviewPathNative: 'assets/images/swibi.png',
        filepathWeb: 'assets/images/swibi.png',
        webviewPathWeb: 'assets/images/swibi.png'
      };
    }
    const data: UserPhotoData = JSON.parse(profilePicString) || null;
    console.log(data);
    if(!this.platform.is('hybrid')){
      const readFile = await Filesystem.readFile({
        path: data.filepathWeb,
        directory: Directory.Data,
      });
      data.webviewPathWeb = `data:image/jpeg;base64,${readFile.data}`;
    }
    console.log(data);
    return data;
  }

  private async savePicture(photo: Photo) {

    const fileName = `${this.auth.currentUser.uid}.jpeg`;
    const base64Data = await this.readAsBase64(photo);
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data
    });

    const nativePhoto: UserPhoto = {
      filepath: savedFile.uri,
      webviewPath: Capacitor.convertFileSrc(savedFile.uri),
    };
    const webPhoto: UserPhoto = {
      filepath: fileName,
      webviewPath: photo.webPath,
    };

    const data: UserPhotoData = {
      filepathNative: nativePhoto.filepath,
      webviewPathNative: nativePhoto.webviewPath,
      filepathWeb: webPhoto.filepath,
      webviewPathWeb: webPhoto.webviewPath,
    };

    await updateDoc(
      doc(this.firestore,`users/${this.auth.currentUser.uid}`),
      {
        profilePic: JSON.stringify(data)
      }
    );
    Preferences.set({
      key: this.storageKey + `/${this.auth.currentUser.uid}`,
      value: JSON.stringify(data),
    });
    return data;
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
