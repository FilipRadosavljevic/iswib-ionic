import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-discovery-page',
  templateUrl: './discovery-page.page.html',
  styleUrls: ['./discovery-page.page.scss'],
})
export class DiscoveryPagePage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  goToPage() {
    this.router.navigate(['/tabs/tab4']);
  }

}
