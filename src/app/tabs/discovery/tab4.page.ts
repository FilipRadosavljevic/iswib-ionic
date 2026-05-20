import { Component, OnDestroy, inject } from '@angular/core'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { DataService } from 'src/app/services/data.service'
import { HeaderComponent } from '../../components/header/header.component'
import { IonicModule } from '@ionic/angular'

interface DiscoveryItem {
  name: string
  image: string
  description?: string
  location?: string
  placeId?: string
}

@Component({
  selector: 'app-discovery',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss'],
  imports: [HeaderComponent, IonicModule],
})
export class Tab4Page implements OnDestroy {
  private router = inject(Router)
  private dataService = inject(DataService)

  data: DiscoveryItem[]
  sub: Subscription

  ngOnDestroy() {
    this.sub.unsubscribe()
  }

  ionViewDidEnter() {
    this.getData()
  }

  async getData() {
    this.sub = this.dataService.getDiscovery().subscribe((res) => {
      this.data = res as DiscoveryItem[]
    })
  }

  // async handleLike(id) {
  //   // this.data[id-1].isLiked = !this.data[id-1].isLiked;
  //   const userid = this.user.getUserId();
  //   this.hasLiked = await this.data[id-1].likes.includes(userid);
  //   // console.log(this.hasLiked);

  //   if(!this.hasLiked) {
  //     this.data[id-1].likes.push(userid);
  //     this.dataService.updateDiscovery(this.data, id);
  //   } else {
  //     this.handleDislike(id);
  //   }
  // }

  // handleDislike(id) {
  //   // this.data[id-1].isLiked = !this.data[id-1].isLiked;
  //   this.data[id-1].likes.splice(id-1, 1);
  //   this.dataService.updateDiscovery(this.data, id);
  // }

  // async toggleHeart(id) {
  //   const userid = this.user.getUserId();
  //   this.hasLiked = await this.data[id-1].likes.includes(userid);
  //   console.log(this.hasLiked);
  //   return 'heart';
  // }

  goToPage(obj) {
    this.router.navigate(['/discovery-page'], {
      state: obj,
    })
  }

  goToLocation(currentObject: DiscoveryItem) {
    const googleLocation = `https://www.google.com/maps/search/?api=1&query=${currentObject.location}&query_place_id=${currentObject.placeId}`
    window.open(googleLocation)
  }
}
