import {Injectable} from '@nestjs/common';
import {UsersService} from "../users/users.service";
import {GameMatch} from "./model/GameMatch";
import {SinglePlayerGameRunner} from "./game-play/SinglePlayerGameRunner";
import {Hand} from "./game-play/Hand";
import {ErrorResponse} from "./model/ErrorResponse";

const GAME_DELAY = 5; // in seconds

@Injectable()
export class BlackjackService {
  constructor(private readonly usersService: UsersService) {}

  async createNewMatch(playerId: number): Promise<GameMatch | ErrorResponse> {
    // create/restore the last match, all is handled in SinglePlayerGameRunner
    const player = await this.getPlayerInfo(playerId)
    /*
      init game runner for this player with last persisted info
      if match don't exist: init new, all is handled in SinglePlayerGameRunner
     */
    let game: SinglePlayerGameRunner;
    try {
      game = new SinglePlayerGameRunner(GAME_DELAY, player.name, player.id);
    } catch (e) {
      return {
        errorCode: 'CreateError',
        message: e.message,
      }
    }

    return this.getGameMatchObj(game, player)
  }

  async getUserLastMatch(playerId: number): Promise<GameMatch | ErrorResponse> {
    const player = await this.getPlayerInfo(playerId)
    /*
      init game runner for this player with last persisted info
      if match don't exist: init new, all is handled in SinglePlayerGameRunner
     */
    let game: SinglePlayerGameRunner;
    try {
      game = new SinglePlayerGameRunner(GAME_DELAY, player.name, player.id);
    } catch (e) {
      return {
        errorCode: 'CreateError',
        message: e.message,
      }
    }

    return this.getGameMatchObj(game, player)
  }

  async hit(playerId: number, matchId: string): Promise<GameMatch | ErrorResponse> {
    const player = await this.getPlayerInfo(playerId)

    let game: SinglePlayerGameRunner;
    try {
      game = new SinglePlayerGameRunner(GAME_DELAY, player.name, player.id);
    } catch (e) {
      return {
        errorCode: 'CreateError',
        message: e.message,
      }
    }

    // validate id
    if (game.lastMatch.id !== matchId) {
      return {
        errorCode: 'InvalidId',
        message: `Invalid match: old=${matchId} new=${game.lastMatch.id}`,
      }
    }

    try {
      game.hit()
    } catch (e) {
      return {
        errorCode: 'HitError',
        message: e.message,
      }
    }

    return this.getGameMatchObj(game, player)
  }

  async stay(playerId: number, matchId: string): Promise<GameMatch | ErrorResponse> {
    const player = await this.getPlayerInfo(playerId)

    let game: SinglePlayerGameRunner;
    try {
      game = new SinglePlayerGameRunner(GAME_DELAY, player.name, player.id);
    } catch (e) {
      return {
        errorCode: 'CreateError',
        message: e.message,
      }
    }

    // validate id
    if (game.lastMatch.id !== matchId) {
      return {
        errorCode: 'InvalidId',
        message: `Invalid match: old=${matchId} new=${game.lastMatch.id}`,
      }
    }

    try {
      game.stay()
    } catch (e) {
      return {
        errorCode: 'HitError',
        message: e.message,
      }
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
      id: game.lastMatch.id,
      dealerHand,
      playerHand,
      player,
      status: game.lastMatch.status,
      stopAt: game.lastMatch.stopAt,
      error,
      delay: GAME_DELAY,
    }
  }
}
