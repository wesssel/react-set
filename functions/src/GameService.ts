import * as admin from 'firebase-admin'
import { Game } from './types'

export class GameService {
  private database: admin.database.Database

  constructor() {
    this.database = admin.database()
  }

  public getGames() {
    return this.database
      .ref('games')
      .once('value')
      .then((snapshots) => {
        const games: Game[] = []
        snapshots.forEach((snapshot) => {
          games.push({
            id: snapshot.key,
            ...snapshot.val()
          })
        })

        return games
      })
  }

  public deleteGame(gameId: string) {
    return this.database
      .ref(`games/${gameId}`)
      .remove()
  }
}
