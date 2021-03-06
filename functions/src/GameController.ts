import { GameService } from "./GameService";
import { Game } from "./types";
import { asyncForEach } from "./helper";

export class GameController {
  private gameService: GameService

  constructor() {
    this.gameService = new GameService()
  }

  public async onGameCleanup() {
    const games: Game[] = await this.gameService.getGames()
    const outdatedGames: Game[] = games.filter((game) => {
      return (!game.isFinished &&
        (new Date().getTime() - game.createdAt) > (3 * 60 * 60 * 1000))  // 3 hours
        || (new Date().getTime() - game.createdAt) > (24 * 60 * 60 * 1000) // 24 hours
    })

    await asyncForEach(outdatedGames, async (game: Game) => {
      await this.gameService.deleteGame(game.id)
    })

    return { success: true }
  }
}
