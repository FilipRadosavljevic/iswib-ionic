import { Component } from '@angular/core';
// import { CameraPreviewOptions } from '@capacitor-community/camera-preview';
// import { CameraPreview } from '@capacitor-community/camera-preview';


@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  // cameraActive = false;

  constructor() {
    const tabs = document.querySelectorAll('ion-tab-button');
    Object.keys(tabs).map((key) => {
      tabs[key].style.display = 'none';
    });
    console.log('asd',tabs);
  }
  // openCamera() {
  //   const cameraPreviewOptions: CameraPreviewOptions = {
  //     position: 'rear',
  //     width: window.screen.width-1,
  //     height: window.screen.height-300
  //   };
  //   CameraPreview.start(cameraPreviewOptions);
  //   // this.cameraActive = true;
  // }
}
