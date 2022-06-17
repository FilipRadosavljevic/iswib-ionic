import { Injectable } from '@angular/core';

import { collectionData, collection,  docData, Firestore, doc, updateDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private firestore: Firestore) {}

  getSchedule() {
    const scheduleRef = collection(this.firestore, 'schedule');
    return collectionData(scheduleRef, { idField: 'id' });
  }

  getWorkshops() {
    const workshopsRef = collection(this.firestore, 'workshops');
    return collectionData(workshopsRef);
  }

  getSponsors() {
    const sponsorsRef = collection(this.firestore, 'sponsors');
    return collectionData(sponsorsRef);
  }

  getRestaurants() {
    const restaurantsRef = collection(this.firestore, 'restaurants');
    return collectionData(restaurantsRef);
  }

  getDiscovery() {
    const discoveryRef = collection(this.firestore, 'discovery');
    return collectionData(discoveryRef);
  }

  getScheduleById(id) {
    const scheduleRef = doc(this.firestore, `schedule/${id}`);
    return docData(scheduleRef, { idField: 'id' });
  }

  updateSchedule(id) {
    const scheduleRef = doc(this.firestore, `schedule/${id}`);
    return updateDoc(scheduleRef, { idField: 'id' });
  }

  updateDiscovery(data, id) {
    const discoveryRef = doc(this.firestore, `discovery/${id}`);
    return updateDoc(discoveryRef, { isLiked: data[id-1].isLiked, likes: data[id-1].likes });
  }
}
