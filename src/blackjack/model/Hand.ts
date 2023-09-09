import { Card } from "./Card";
import { HandDto, HandStatus } from "../datasource/db-collection/Matchs";

export class Hand {
  playerId: string // 1 player can have n hands
  handIdx: number;
  private cards: Card[];
  status: HandStatus;

  /**
   * @param handIdx of hand in match
   * @param playerId of hand in match
   */
  constructor(handIdx: number, playerId = "") {
    this.playerId = playerId
    this.handIdx = handIdx
    this.cards = []
    this.status = HandStatus.Hit
  }

  static from(dto: HandDto): Hand {
    const h = new Hand(dto.handIdx, dto.playerId)
    h.status = dto.status
    h.cards = dto.cards
    return h
  }

  getCards(): Card[] {
    return this.cards;
  }

  // eval cards on hand
  private eval(): HandStatus {
    return HandStatus.Hit; // TODO
  }

  // add card to the hand
  // this operation is for initializing or unit test
  unsafeAddCard(card: Card) {
    this.cards.push(card)
  }

  hit(card: Card) {
    this.unsafeAddCard(card)
    // TODO
  }

  stay() {
    this.status = HandStatus.Stay
  }
}
