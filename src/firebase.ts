import * as firebase from 'firebase/app'
import 'firebase/database'
import { Card, Fill, Color, Shape, Player } from './types'

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

  constructor() {
    firebase.initializeApp(this.config)
    this.database = firebase.database()
  }

  public async setGameDate(gameId: string): Promise<void> {
    this.database.ref(`games/${gameId}/createdAt`).set(new Date().getTime())
  }

  public async setGameFinished(gameId: string): Promise<void> {
    this.database.ref(`games/${gameId}/isFinished`).set(true)
  }

  public async setGameCards(gameId: string, cards: Card[]): Promise<void> {
    this.database.ref(`games/${gameId}/cards/`).remove()

    cards.forEach((card, index) => {
      this.database.ref(`games/${gameId}/cards/${index}`).set(this.transformCardIndexes(card))
    })
  }

  public async setGamePlayerJoined(gameId: string, playerId: string) {
    this.database.ref(`games/${gameId}/players/${playerId}/joinedAt`).set(new Date().getTime())
  }

  public async setGamePlayerIsReady(gameId: string, playerId: string) {
    this.database.ref(`games/${gameId}/players/${playerId}/isReady`).set(true)
  }

  public async setGameSets(gameId: string, playerId: string, sets: Card[][]) {
    sets.forEach((set, index) => {
      const setIndexes = set.map((card) => this.transformCardIndexes(card))

      this.database.ref(`games/${gameId}/players/${playerId}/sets/${index}`).set(setIndexes)
    })
  }

  public async setPlayerScore(score: Player) {
    this.database.ref(`leaderboards`).push(score)
  }

  public getGameCards(gameId: string): Promise<Card[]> {
    return this.database
      .ref(`games/${gameId}/cards`)
      .once('value')
      .then((snapshots) => {
        const cards: Card[] = []
        snapshots.forEach((snapshot) => {
          cards.push(this.reverseTransformCardIndexes(snapshot.val()))
        })

        return cards
      })
  }

  public getGameSets(gameId: string, playerId: string): Promise<Card[][]> {
    return this.database
      .ref(`games/${gameId}/players/${playerId}/sets`)
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

  public getPlayerScores(): Promise<Player[]> {
    return this.database
      .ref(`leaderboards`)
      .once('value')
      .then((snapshots) => {
        const scores: Player[] = []
        snapshots.forEach((snapshot) => {
          scores.push(snapshot.val())
        })

        return scores
      })
  }

  public onGamePlayerUpdate(gameId: string) {
    return this.database
      .ref(`games/${gameId}/players`)
      .on('value', (snapshots) => {
        const players: Player[] = []
        snapshots.forEach((snapshot) => {
          players.push({
            ...snapshot.val(),
            playerName: snapshot.key,
          })
        })
        document.dispatchEvent(new CustomEvent('playersUpdate', {
          detail: players
        }))
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
