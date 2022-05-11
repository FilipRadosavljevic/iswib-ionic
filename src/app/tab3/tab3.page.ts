import { Component, OnInit } from '@angular/core';
// import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Platform } from '@ionic/angular';

const IMAGE_DIR = 'stored-images';
interface LocalFile {
  name: string;
  path: string;
  data: string;
}
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit{

  images: LocalFile[] = [];

  constructor(private platform: Platform) {}

  async ngOnInit() {

  }

  async selectImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos
    });
    console.log(image);
    if(image) {
      this.saveImage(image);
    }
  }

  async saveImage(photo: Photo) {
    const base64Data = await this.readAsBase64(photo);
    console.log(base64Data);

    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      directory: Directory.Data,
      path: `${IMAGE_DIR}/${fileName}`,
      data: base64Data
    });
    console.log('savedFile:', savedFile);

  }

  async readAsBase64(photo: Photo) {
    if (this.platform.is('hybrid')) {
      const file = await Filesystem.readFile({
        path: photo.path
      });
      return file.data;
    } else {
      const response = await fetch(photo.webPath);
      const blob = await response.blob();

      return await this.convertBlobToBase64(blob) as string;
    }
  }

  convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });
  // imageElement: SafeResourceUrl;

  // constructor(private domSanitizer: DomSanitizer) {}

  // async takePicture() {
  //   const image = await Camera.getPhoto({
  //     quality: 90,
  //     allowEditing: true,
  //     source: CameraSource.Camera,
  //     resultType: CameraResultType.Base64
  //   });
  //   // image.webPath will contain a path that can be set as an image src.
  //   // You can access the original file using image.path, which can be
  //   // passed to the Filesystem API to read the raw data of the image,
  //   // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
  //   // const imageUrl = image.webPath;
  //   // Can be set to the src of an image now
  //   this.imageElement = this.domSanitizer.bypassSecurityTrustResourceUrl(image && image.base64String);
  // };
}
