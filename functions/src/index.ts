import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { GameController } from './GameController'

import serviceAccount = require('./keys/admin-key.json')

admin.initializeApp({
  // @ts-ignore
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${process.env.REACT_APP_FIREBASE_APP}.firebaseio.com`,
});

export const gameCleanupInterval = functions.pubsub
  .schedule('every 4 hours')
  .onRun((context) => new GameController().onGameCleanup());


export const gameCleanupEndpoint = functions.https
  .onRequest(async (request, response) => {
    const res = new GameController().onGameCleanup()
    response.json(res)
  })
