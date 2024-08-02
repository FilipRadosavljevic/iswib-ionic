import { FirestoreDataConverter } from '@angular/fire/firestore'

export class Activity {
  constructor(
    public title: string,
    public description: string,
    public date: string,
    public begin: string,
    public end: string,
    public cost: string,
    public apply: string,
    public image?: string,
  ) {}
}

export const activityConverter: FirestoreDataConverter<Activity> = {
  toFirestore: (activity: Activity) => ({
    title: activity.title,
    description: activity.description,
    date: activity.date,
    begin: activity.begin,
    end: activity.end,
    cost: activity.cost,
    apply: activity.apply,
    image: activity.image,
  }),
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options)

    return new Activity(
      data['title'],
      data['description'],
      data['date'],
      data['begin'],
      data['end'],
      data['cost'],
      data['apply'],
      data['image'],
    )
  },
}
