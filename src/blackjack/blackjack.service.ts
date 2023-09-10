import {Injectable} from '@nestjs/common';
import {UsersService} from "../users/users.service";
import {GameMatch} from "./model/GameMatch";
import {HandDto, HandStatus, MatchStatus} from "./datasource/db-collection/Matchs";
import {SinglePlayerGameRunner} from "./game-play/SinglePlayerGameRunner";
import {Hand} from "./game-play/Hand";

const GAME_DELAY = 10; // in seconds

@Injectable()
export class BlackjackService {
  constructor(private readonly usersService: UsersService) {}

  async createNewMatch(playerId: number): Promise<GameMatch> {
    // create/restore the last match, all is handled in SinglePlayerGameRunner
    return this.getUserLastMatch(playerId)
  }

  async getUserLastMatch(playerId: number): Promise<GameMatch> {
    const player = await this.getPlayerInfo(playerId)
    /*
      init game runner for this player with last persisted info
      if match don't exist: init new, all is handled in SinglePlayerGameRunner
     */
    const game = new SinglePlayerGameRunner(GAME_DELAY, player.name, player.id);

    return this.getGameMatchObj(game, player)
  }

  async hit(playerId: number): Promise<GameMatch> {
    const player = await this.getPlayerInfo(playerId)
    const game = new SinglePlayerGameRunner(GAME_DELAY, player.name, player.id);

    try {
      game.hit()
    } catch (e) {
      return this.getGameMatchObj(game, player, e.message)
    }

    return this.getGameMatchObj(game, player)
  }

  async stay(playerId: number): Promise<GameMatch> {
    const player = await this.getPlayerInfo(playerId)
    const game = new SinglePlayerGameRunner(GAME_DELAY, player.name, player.id);

    try {
      game.stay()
    } catch (e) {
      return this.getGameMatchObj(game, player, e.message)
    }

    return this.getGameMatchObj(game, player)
  }

  private async getPlayerInfo(playerId: number): Promise<{ id: string, name: string }> {
    const user = await this.usersService.findOne({id: playerId});
    return {name: user?.firstName ?? "You", id: "" + playerId}
  }

  private getGameMatchObj(game: SinglePlayerGameRunner, player: any, error: string = ''): GameMatch {
    const dealerHand = Hand.to(game.lastMatch.hands[0]);
    const playerHand = Hand.to(game.lastMatch.hands[1]);

    return {
      dealerHand,
      playerHand,
      player,
      status: game.lastMatch.status,
      stopAt: game.lastMatch.stopAt,
      error,
    }
  }
}
