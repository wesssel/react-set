import * as firebase from 'firebase/app'
import 'firebase/database'
import { Card, Fill, Color, Shape } from './types'

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

  constructor() {
    console.log(process.env.REACT_APP_FIREBASE_ID)
    firebase.initializeApp(this.config)
    this.database = firebase.database()
  }

  public async setGameCards(cards: Card[]): Promise<void> {
    cards.forEach((card) => {
      this.database.ref(`games/${this.gameId}/cards`).push(this.transformCardIndexes(card))
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

  private transformCardIndexes(card: Card): [number, number, number, number, number] {
    return [
      card.id,
      this.transformCardFillIndex(card.fill),
      this.transformCardShapeIndex(card.shape),
      this.transformCardColorIndex(card.color),
      this.transformCardAmountIndex(card.amount),
    ]
  }

  private transformCardFillIndex(fill: Fill): number {
    return Object.values(Fill).indexOf(fill);
  }

  private transformCardShapeIndex(shape: Shape): number {
    return Object.values(Shape).indexOf(shape);
  }

  private transformCardColorIndex(color: Color): number {
    return Object.values(Color).indexOf(color);
  }

  private transformCardAmountIndex(amount: number): number {
    return amount - 1
  }

  private reverseTransformCardIndexes(indexes: [number, number, number, number, number]): Card {
    return {
      id: indexes[0],
      fill: Object.values(Fill)[indexes[1]],
      shape: Object.values(Shape)[indexes[2]],
      color: Object.values(Color)[indexes[3]],
      amount: indexes[4] + 1,
    }
  }
}
