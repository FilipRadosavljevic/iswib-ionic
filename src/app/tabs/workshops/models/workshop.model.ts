import { FirestoreDataConverter } from '@angular/fire/firestore'

export class Workshop {
  constructor(
    public workshopId: string,
    public title: string,
    public description: string,
    public moderator: string,
    public cardColor: string,
    public textColor: string,
    public image?: string,
    public image2?: string,
    public image3?: string,
  ) {}
}

export const workshopConverter: FirestoreDataConverter<Workshop> = {
  toFirestore: (workshop: Workshop) => ({
    title: workshop.title,
    description: workshop.description,
    moderator: workshop.moderator,
    cardColor: workshop.cardColor,
    textColor: workshop.textColor,
    image: workshop.image,
    image2: workshop.image2,
    image3: workshop.image3,
  }),
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options)

    return new Workshop(
      snapshot.id,
      data['title'],
      data['description'],
      data['moderator'],
      data['cardColor'],
      data['textColor'],
      data['image'],
      data['image2'],
      data['image3'],
    )
  },
}
