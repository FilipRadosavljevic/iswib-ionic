import { FirestoreDataConverter } from '@angular/fire/firestore'

export type ScheduleEvent = {
  eventTitle: string
  timeFrom: string
  timeTo: string
  placeId: string
  location: string
  image: string
}

export class ScheduleDay {
  constructor(
    public scheduleDayId: string,
    public date: string,
    public dayOfWeek: string,
    public events: ScheduleEvent[],
  ) {}
}

export const scheduleDayConverter: FirestoreDataConverter<ScheduleDay> = {
  toFirestore: (scheduleDay: ScheduleDay) => ({
    ...scheduleDay,
  }),
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options) as Record<number, ScheduleEvent>

    const events = data
      ? Object.keys(data)
          .map(Number)
          .filter((key) => !isNaN(key))
          .sort((a, b) => a - b)
          .map((key) => data[key])
      : []

    return new ScheduleDay(snapshot.id, data['date'], data['dayOfWeek'], events)
  },
}
