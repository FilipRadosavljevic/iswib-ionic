import { Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'

import { collectionData, collection, Firestore } from '@angular/fire/firestore'
import { Workshop, workshopConverter } from '../tabs/workshops/models/workshop.model'
import { ScheduleDay, scheduleDayConverter } from '../tabs/schedule/models/schedule-day.model'

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private firestore = inject(Firestore)


  getSchedule(): Observable<ScheduleDay[]> {
    const scheduleRef = collection(this.firestore, 'schedule').withConverter(scheduleDayConverter)
    return collectionData(scheduleRef) as Observable<ScheduleDay[]>
  }

  getWorkshops(): Observable<Workshop[]> {
    const workshopsRef = collection(this.firestore, 'workshops').withConverter(workshopConverter)
    return collectionData(workshopsRef) as Observable<Workshop[]>
  }

  getSponsors() {
    const sponsorsRef = collection(this.firestore, 'sponsors')
    return collectionData(sponsorsRef)
  }

  getRestaurants() {
    const restaurantsRef = collection(this.firestore, 'restaurants')
    return collectionData(restaurantsRef)
  }

  getDiscovery() {
    const discoveryRef = collection(this.firestore, 'discovery')
    return collectionData(discoveryRef)
  }
}
