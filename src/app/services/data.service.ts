import { Injectable } from '@angular/core'

import { collectionData, collection, Firestore } from '@angular/fire/firestore'
import { workshopConverter } from '../tabs/workshops/models/workshop.model'
import { scheduleDayConverter } from '../tabs/schedule/models/schedule-day.model'

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private firestore: Firestore) {}

  getSchedule() {
    const scheduleRef = collection(this.firestore, 'schedule').withConverter(scheduleDayConverter)
    return collectionData(scheduleRef)
  }

  getWorkshops() {
    const workshopsRef = collection(this.firestore, 'workshops').withConverter(workshopConverter)
    return collectionData(workshopsRef)
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
