import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss']
})
export class Tab4Page implements OnInit, OnDestroy {

  data: any;
  sub: Subscription;

  constructor(
    private router: Router,
    private dataService: DataService,
    private user: UsersService
    ) {}

  ngOnInit() {
    this.getData();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  async getData() {
    this.sub = this.dataService.getDiscovery().subscribe(res => {
      this.data = res;
    });
  }

  handleLike(id) {
    this.data[id-1].isLiked = !this.data[id-1].isLiked;
    const userID = this.user.getUserId();
    this.data[id-1].likes.push(userID);
    console.log(this.data);

    // this.dataService.updateDiscovery(this.data, id);
  }

  handleDislike(id) {
    this.data[id-1].isLiked = !this.data[id-1].isLiked;
    this.data[id-1].likes.splice(id-1, 1);
    console.log(this.data);
    // this.dataService.updateDiscovery(this.data, id);
  }

  goToPage() {
    this.router.navigate(['/discovery-page']);
  }

  goToLocation(id) {
    window.open(this.data[id-1].location);
  }

}
