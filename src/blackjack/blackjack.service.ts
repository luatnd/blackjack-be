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
    const user = await this.usersService.findOne({ id: playerId });
    // console.log('{getUserLastMatch} user: ', user);

    /*
      init game runner for this player with last persisted info
      if match don't exist: init new, all is handled in SinglePlayerGameRunner
     */
    const game = new SinglePlayerGameRunner(GAME_DELAY, user?.firstName ?? "You", "" + playerId);
    // console.log('{getUserLastMatch} game: ', game.lastMatch);

    const dealerHand: HandDto = Hand.to(game.lastMatch.hands[0]);
    const playerHand: HandDto = Hand.to(game.lastMatch.hands[1]);

    return {
      dealerHand,
      playerHand,
      status: game.lastMatch.status,
      stopAt: game.lastMatch.stopAt,
    }
  }

  hit() {

  }

  stay() {

  }

}
