import { Injectable } from '@angular/core';

import { collectionData, collection,  docData, Firestore, doc, updateDoc } from '@angular/fire/firestore';
// import { collection } from '@firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private firestore: Firestore) {}

  getSchedule() {
    const scheduleRef = collection(this.firestore, 'schedule');
    return collectionData(scheduleRef, { idField: 'id' });
  }

  getScheduleById(id) {
    const scheduleRef = doc(this.firestore, `schedule/${id}`);
    return docData(scheduleRef, { idField: 'id' });
  }

  updateSchedule(id) {
    const scheduleRef = doc(this.firestore, `schedule/${id}`);
    return updateDoc(scheduleRef, { idField: 'id' });
  }

  getDiscovery() {
    const discoveryRef = collection(this.firestore, 'discovery');
    return collectionData(discoveryRef, { idField: 'id' });
  }

  updateDiscovery(data, id) {
    console.log(data);
    const discoveryRef = doc(this.firestore, `discovery/${id}`);
    return updateDoc(discoveryRef, { isLiked: data[id-1].isLiked, likes: data[id-1].likes });
  }
}
