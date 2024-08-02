import { Component, OnInit, OnDestroy } from '@angular/core'
import { Subject, Subscription } from 'rxjs'
import { DataService } from 'src/app/services/data.service'
import { Activity } from './models/activity.model'
import { takeUntil } from 'rxjs/operators'
import { Router } from '@angular/router'
import { AuthService } from 'src/app/services/auth/auth.service'
import { User } from 'src/app/models/user.model'

@Component({
  selector: 'app-restaurants',
  templateUrl: 'tab5.page.html',
  styleUrls: ['tab5.page.scss'],
})
export class Tab5Page implements OnInit, OnDestroy {
  activities: Activity[] = []

  ngUnsubscribe = new Subject<void>()

  currentUser: User | null = null;


  constructor(private router: Router,
    private dataService: DataService,
    private authService: AuthService) {}

  ngOnInit() {
    this.dataService
      .getActivities()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((activities) => {
        this.activities = [...activities]
      })

      this.authService.user.subscribe((user) => {
        this.currentUser = user;
        console.log('Authenticated user:', this.currentUser); // Debugging
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next()
    this.ngUnsubscribe.complete()
  }

  goToPage(obj) {
    this.router.navigate(['/activity-page'], {
      state: obj,
    })
  }
  
  async applyToActivity(activity: Activity) {
    if (this.currentUser) {
      console.log('Current user:', this.currentUser); // Debugging
      console.log('Activity:', activity); // Debugging
      await this.dataService.addUserToActivity(activity.title, this.currentUser);
    } else {
      console.error('No user is logged in.');
    }
  }

}
