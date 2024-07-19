import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'
import * as logger from 'firebase-functions/logger'
import { CallableRequest } from 'firebase-functions/v2/https'
import { UserRequest } from './models/user-request.model'
import { FunctionResponse } from './models/function-response.model'
import { userRequestConverter } from './models/user-request-converter.model'

export type CreateUserRequestData = {
  email: string
  password: string
  firstName: string
  lastName: string
  role: string
}

export interface CreateUserResponse extends FunctionResponse {
  userId?: string
  userRequestId?: string
}

export const createUserRequestHandler = async (
  request: CallableRequest<CreateUserRequestData>,
): Promise<CreateUserResponse> => {
  try {
    const auth = getAuth()
    const firestore = getFirestore()

    const email = request.data.email.trim()
    const password = request.data.password
    const firstName = request.data.firstName.trim()
    const lastName = request.data.lastName.trim()
    const role = request.data.role

    const userRecord = await auth.createUser({
      email,
      emailVerified: false,
      password,
      displayName: `${firstName} ${lastName}`,
      disabled: true,
    })

    const userId = userRecord.uid

    logger.info('Created User with ID: ', userId, { structuredData: true })

    const userRequest = new UserRequest(userId, email, firstName, lastName, role)

    const docRef = await firestore
      .collection('user-requests')
      .withConverter(userRequestConverter)
      .add(userRequest)

    logger.info('Added User Request Document with ID: ', docRef.id, { structuredData: true })

    return {
      status: 200,
      message: 'User Account Created Successfully',
      userId,
      userRequestId: docRef.id,
    }
  } catch (e) {
    const error = e as Error

    return {
      status: 500,
      message: error.message,
    }
  }
}
