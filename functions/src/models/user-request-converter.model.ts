import { UserRequest } from './user-request.model'
import { firestore } from 'firebase-admin'
import FirestoreDataConverter = firestore.FirestoreDataConverter

export const userRequestConverter: FirestoreDataConverter<UserRequest> = {
  toFirestore(modelObject) {
    return {
      userId: modelObject.userId,
      email: modelObject.email,
      role: modelObject.role,
      firstName: modelObject.firstName,
      lastName: modelObject.lastName,
    }
  },
  fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot) {
    const data = snapshot.data()

    return new UserRequest(
      data['userId'],
      data['email'],
      data['firstName'],
      data['lastName'],
      data['role'],
    )
  },
}
