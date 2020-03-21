import * as firebase from 'firebase/app'
import 'firebase/database'
import { Card, Fill, Color, Shape } from './types'

type CardIndexes = [number, number, number, number, number]

export class Firebase {
  private database: firebase.database.Database
  private config = {
    apiKey: process.env.REACT_APP_FIREBASE_KEY,
    authDomain: `${process.env.REACT_APP_FIREBASE_ID}.firebaseapp.com`,
    databaseURL: `https://${process.env.REACT_APP_FIREBASE_ID}.firebaseio.com`,
    projectId: `${process.env.REACT_APP_FIREBASE_ID}`,
    storageBucket: `${process.env.REACT_APP_FIREBASE_ID}.appspot.com`,
    appId: process.env.REACT_APP_FIREBASE_APP,
  }
  private gameId: string = 'test-game'
  private playerId: string = ''

  constructor() {
    firebase.initializeApp(this.config)
    this.database = firebase.database()
    this.playerId = 'test-id'
  }

  public async setGameCards(cards: Card[]): Promise<void> {
    this.database.ref(`games/${this.gameId}/cards/`).remove()

    cards.forEach((card, index) => {
      this.database.ref(`games/${this.gameId}/cards/${index}`).set(this.transformCardIndexes(card))
    })
  }

  public async setGameSets(sets: Card[][]) {
    sets.forEach((set, index) => {
      const setIndexes = set.map((card) => this.transformCardIndexes(card))

      this.database.ref(`games/${this.gameId}/players/${this.playerId}/sets/${index}`).set(setIndexes)
    })
  }

  public getGameCards(): Promise<Card[]> {
    return this.database
      .ref(`games/${this.gameId}/cards`)
      .once('value')
      .then((snapshots) => {
        const cards: Card[] = []
        snapshots.forEach((snapshot) => {
          cards.push(this.reverseTransformCardIndexes(snapshot.val()))
        })

        return cards
      })
  }

  public getGameSets(): Promise<Card[][]> {
    return this.database
      .ref(`games/${this.gameId}/players/${this.playerId}/sets`)
      .once('value')
      .then((snapshots) => {
        const sets: Card[][] = []
        snapshots.forEach((snapshot) => {
          const cards = snapshot.val().map((indexes: CardIndexes) => this.reverseTransformCardIndexes(indexes))
          sets.push(cards)
        })

        return sets
      })
  }

  private transformCardIndexes(card: Card): CardIndexes {
    return [
      card.id,
      Object.values(Fill).indexOf(card.fill),
      Object.values(Shape).indexOf(card.shape),
      Object.values(Color).indexOf(card.color),
      card.amount - 1,
    ]
  }

  private reverseTransformCardIndexes(indexes: CardIndexes): Card {
    return {
      id: indexes[0],
      fill: Object.values(Fill)[indexes[1]],
      shape: Object.values(Shape)[indexes[2]],
      color: Object.values(Color)[indexes[3]],
      amount: indexes[4] + 1,
    }
  }
}
