import { Component, OnDestroy, OnInit } from '@angular/core';
import { onValue, set } from '@angular/fire/database';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../services/auth/authentication.service';
import { User } from '../models/user.model';
import { PhotoService } from '../services/photo.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {
  user: User;
  userSub: Subscription;

  constructor(
    public authService: AuthenticationService,
    public photoService: PhotoService
  ) {}

  async ngOnInit() {
    //await this.photoService.loadSaved();
    this.userSub = this.authService.user.subscribe(user => {
      console.log(user);
      this.user = user;
    });
  }

  ngOnDestroy() {
    console.log('ngOnDestroy');
    if(this.userSub){
      this.userSub.unsubscribe();
    }
  }

  async onChooseNewProfilePic() {
    const newImage = await this.photoService.addNewProfilePic();
    this.user.profilePic = newImage.webviewPath;
  }
}
