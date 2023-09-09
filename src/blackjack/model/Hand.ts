import { Card } from "./Card";
import { HandStatus } from "../datasource/db-collection/Matchs";

export class Hand {
  // playerId: string // 1 player can have n hands
  handIdx: number;
  private cards: Card[];
  status: HandStatus;

  /**
   * @param handIdx of hand in match
   */
  constructor(handIdx: number) {
    this.handIdx = handIdx
    this.cards = []
    this.status = HandStatus.Hit
  }

  // eval cards on hand
  private eval(): HandStatus {
    return HandStatus.Hit; // TODO
  }

  // add card to the hand
  private addCard(card: Card) {
    // TODO
  }

  hit(card: Card) {
    this.addCard(card)
    // TODO
  }

  stay() {
    this.status = HandStatus.Stay
  }
}
