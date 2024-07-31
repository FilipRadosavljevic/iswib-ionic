import { FirestoreDataConverter } from '@angular/fire/firestore'

export class Sponsor {
  constructor(
    public title: string,
    public description: string,
    public cardColor: string,
    public textColor: string,
    public image?: string,
  ) {}
}

export const sponsorConverter: FirestoreDataConverter<Sponsor> = {
  toFirestore: (sponsor: Sponsor) => ({
    title: sponsor.title,
    description: sponsor.description,
    cardColor: sponsor.cardColor,
    textColor: sponsor.textColor,
    image: sponsor.image,
  }),
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options)

    return new Sponsor(
      data['title'],
      data['description'],
      data['cardColor'],
      data['textColor'],
      data['image'],
    )
  },
}
