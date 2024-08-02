import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Activity } from '../tabs/restaurants/models/activity.model';

@Component({
  selector: 'app-activity-page',
  templateUrl: './activity-page.page.html',
  styleUrls: ['./activity-page.page.scss'],
})
export class ActivityPagePage implements OnInit {

  activities: any

  constructor(private router: Router) {
    this.activities = this.router.getCurrentNavigation().extras.state
  }

  ngOnInit() {}

  goToPage() {
    this.router.navigate(['/tabs/tab5'])
  }

}
