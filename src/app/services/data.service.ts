import { Injectable } from '@angular/core'

import { collectionData, collection, Firestore, setDoc, arrayUnion, doc } from '@angular/fire/firestore'
import { sponsorConverter } from '../tabs/workshops/models/sponsor.model'
import { scheduleDayConverter } from '../tabs/schedule/models/schedule-day.model'
import { activityConverter } from '../tabs/restaurants/models/activity.model'
import { User } from '../models/user.model'

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private firestore: Firestore) {}

  getSchedule() {
    const scheduleRef = collection(this.firestore, 'schedule').withConverter(scheduleDayConverter)
    return collectionData(scheduleRef, { idField: 'id' })
  }

  getSponsors() {
    const sponsorsRef = collection(this.firestore, 'sponsors').withConverter(sponsorConverter)
    return collectionData(sponsorsRef)
  }

  getActivities() {
    const activityRef = collection(this.firestore, 'optional_activities').withConverter(activityConverter)
    return collectionData(activityRef)
  }

  getDiscovery() {
    const discoveryRef = collection(this.firestore, 'discovery')
    return collectionData(discoveryRef)
  }

  async addUserToActivity(activityTitle: string, user: User) {
    const userGoingRef = doc(this.firestore, 'user-going', activityTitle);
    console.log('Activity: ', activityTitle)

    try {
      await setDoc(
        userGoingRef,
        {
          users: arrayUnion({
            firstName: user.firstName,
            lastName: user.lastName,
          }),
        },
        { merge: true }
      );

      console.log('User added successfully'); // Debugging
    } catch (error) {
      console.error('Error updating user-going list:', error);
    }
  }
}
