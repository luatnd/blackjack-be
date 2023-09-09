import { Card } from "./Card";
import { HandDto, HandStatus } from "../datasource/db-collection/Matchs";

const BlackJackPoint = 21;

export class Hand {
  playerId: string // 1 player can have n hands
  handIdx: number;
  private cards: Card[];
  status: HandStatus;

  // this is the best point of hand
  get point() {
    /*
    Point of hand should be nearest to 21
    because Ace can be 1 or 11
     */
    // this.cards.reduce((acc, i) => acc + i.value, 0);
    let aceCount = 0;
    let sumWithoutAce = 0;
    for (let i = 0, c = this.cards.length; i < c; i++) {
      const c = this.cards[i];
      if (c.face == "A") {
        aceCount++
      } else {
        sumWithoutAce += c.value
      }
    }

    if (aceCount == 0) {
      return sumWithoutAce
    }

    let min = sumWithoutAce;
    for (let i = 0; i < aceCount; i++) {
      if (i == aceCount - 1 && min + 11 <= BlackJackPoint) {
        min += 11;
      } else {
        min += 1;
      }
    }

    return min
  }

  // has no more turn
  get stopped() {
    return this.status != HandStatus.Hit
  }

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
  static to(h: Hand): HandDto {
    return {
      playerId: h.playerId,
      handIdx: h.handIdx,
      cards: [...h.cards],
      status: h.status,
    }
  }

  getCards(): Card[] {
    return this.cards;
  }

  // eval cards on hand
  private eval(): HandStatus {
    // dealer need to continue get card until >= 17 ==> move this logic to match
    // if (this.isDealer()) {}

    // eval
    const p = this.point
    if (p === BlackJackPoint) {
      this.status = HandStatus.BlackJack;
    }
    if (p > BlackJackPoint) {
      this.status = HandStatus.Burst;
    }

    return this.status
  }

  // add card to the hand
  // public this operation is for initializing or unit test
  unsafeAddCard(card: Card) {
    this.cards.push(card)
  }

  hit(card: Card): HandStatus {
    if (this.status != HandStatus.Hit) {
      throw new Error(`Hand status must be hit, your hand status: ${this.status}`)
    }

    this.unsafeAddCard(card)
    return this.eval()
  }

  stay() {
    // can not stay if finished
    if (this.wasStoppedAndWaitingDealerTurn()) {
      throw new Error(`Cannot stay, hand is waiting for eval by dealer: ${this.status}`)
    }

    this.status = HandStatus.Stay
    // return this.eval()
    return this.status
  }

  isDealer() {
    return this.handIdx === 0
  }

  wasStoppedAndWaitingDealerTurn() {
    return this.status === HandStatus.Stay ||
      this.status === HandStatus.BlackJack;
  }
}
