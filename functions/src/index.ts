import * as firebase from 'firebase-admin'
import { onCall } from 'firebase-functions/v2/https'

import { CreateUserRequestData, createUserRequestHandler } from './create-user-request.function'

firebase.initializeApp()

export const createUserRequest = onCall<CreateUserRequestData>(
  { region: 'europe-central2' },
  createUserRequestHandler,
)
