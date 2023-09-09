import { Match } from "./Match";
import { DEALER_ID, PlayerDao, PlayerDto } from "../datasource/dao/Player.dao";
import { MatchDao } from "../datasource/dao/Match.dao";
import { MatchStatus } from "../datasource/db-collection/Matchs";
import { Card } from "./Card";

/**
 * This is game runner class
 * This runner support only 1 player + dealer
 *
 * Usage:
 *  g = SinglePlayerGameRunner(delay, playerName)
 *  g.newMatch()
 *  g.hit()
 *  g.stay()
 */
export class SinglePlayerGameRunner {
  delay: number = 0; // the duration between each round
  player: PlayerDto;
  lastMatch: Match;
  lastMatchStopTs: number = 0;

  constructor(delay: number, playerName: string, playerId: string) {
    this.init(delay, playerName, playerId);
  }

  /**
   * Init a new game runner for this user
   *
   * @param delay
   * @param playerName
   * @param playerId
   */
  private init(delay: number, playerName: string, playerId: string, option?: Record<string, any>) {
    this.delay = delay;

    // get playerId from player name
    // const player = new PlayerDao().upsertPlayer(playerName);
    // this.player = player
    this.player = {
      id: playerId,
      name: playerName,
    }

    // restore from user last playing match
    const userLastMatch = new MatchDao().findByPlayerId(this.player.id);

    if (userLastMatch && userLastMatch.status == MatchStatus.Playing) {
      this.lastMatch = Match.from(userLastMatch)
    } else {
      // or create new match
      this.initMatch()
    }
  }

  // for unit test
  static cleanMatch(playerId: string) {
    new MatchDao().deleteByPlayerId(playerId);
  }

  // init match
  // customDeck is use for debug + unit test only
  private initMatch(customDeck?: Card[]) {
    if (Date.now() - this.lastMatchStopTs < this.delay * 1000) {
      throw new Error(`Need to wait ${this.delay} seconds between each round`);
      // TODO: Unit test
    }

    const playerIds = [DEALER_ID, this.player.id];
    // in this game runner: Each player can have only 1 hand
    const playerHandCount = new Array(playerIds.length).fill(1);

    if (customDeck) {
      this.lastMatch = Match.newWithDebug(playerIds, playerHandCount, customDeck);
    } else {
      this.lastMatch = Match.new(playerIds, playerHandCount);
    }


    // persist
    // TODO
  }

  // for debug only
  debugReInitMatch(customDeck: Card[]) {
    this.initMatch(customDeck)
  }

  newMatch() {
    this.initMatch()
  }

  hit() {
    // validation
    if (this.lastMatch.status != MatchStatus.Playing) {
      throw new Error("Invalid match status: " + this.lastMatch.status)
    }

    // const handIdx = TODO;
    // this.lastMatch.playerHit(handIdx)

    // return TODO
  }

  stay() {
    // validation
    if (this.lastMatch.status != MatchStatus.Playing) {
      throw new Error("Invalid match status: " + this.lastMatch.status)
    }

    // const handIdx = TODO;
    // this.lastMatch.playerStay(handIdx)

    // return TODO
  }
}
