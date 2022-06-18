import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-discovery-page',
  templateUrl: './discovery-page.page.html',
  styleUrls: ['./discovery-page.page.scss'],
})
export class DiscoveryPagePage implements OnInit {

  data: any;

  constructor(private router: Router) {
    this.data = this.router.getCurrentNavigation().extras.state;
   }

  ngOnInit() {
  }

  goToPage() {
    this.router.navigate(['/tabs/tab4']);
  }

  goToLocation() {
    window.open(this.data.location);
  }

}
