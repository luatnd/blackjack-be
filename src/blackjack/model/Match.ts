import { MatchDto, MatchStatus } from "../datasource/db-collection/Matchs";
import { Hand } from "./Hand";
import { Card } from "./Card";

/*
  This BlackJack Match support multiple hands
 */
export class Match {
  hands: Hand[] = []; // NOTE: Dealer hand is always at 0
  deck: Card[] = [];
  status: MatchStatus = MatchStatus.Playing;

  // prevent this entry point
  private constructor() {}

  static from(daoObj: MatchDto): Match {
    const match = new Match()
    // TODO

    return match
  }

  static new(playerIds: string[], playerHandCount: number[]): Match {
    const match = new Match()
    match.init(playerIds, playerHandCount)

    return match
  }

  private init(playerIds: string[], playerHandCount: number[]) {
    // new shuffled 52 cards deck
    // create hands for players, dealer is player 0
    // player will play first
  }

  // When all the player hands is stay, it's dealer turn
  private isDealerTurn(): boolean {
    return false // TODO
  }

  playerHit(handIdx: number) {
    // validate

    // --
    const hand = this.hands[handIdx];
    const card: Card = TODO;
    hand.hit(card)
  }

  playerStay(handIdx: number) {
    // validate

    // then
    const hand = this.hands[handIdx];
    hand.stay()
  }
}
