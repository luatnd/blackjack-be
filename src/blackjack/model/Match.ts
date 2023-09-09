import { MatchDto, MatchStatus } from "../datasource/db-collection/Matchs";
import { Hand } from "./Hand";
import { Card, CardVariant, getCard } from "./Card";

/*
  This BlackJack Match support multiple hands
 */
export class Match {
  hands: Hand[] = []; // NOTE: Dealer hand is always at 0
  deck: Card[] = [];
  status: MatchStatus = MatchStatus.Playing;

  // prevent this entry point
  private constructor() {}

  static from(dto: MatchDto): Match {
    const match = new Match();
    match.deck = dto.deck;
    match.hands = dto.hands.map(i => Hand.from(i));
    match.status = dto.status;

    return match;
  }

  static new(playerIds: string[], playerHandCount: number[]): Match {
    const match = new Match();
    match.init(playerIds, playerHandCount);
    match.init2CardEachHand()
    return match;
  }

  // For debug + unit testing only
  // customDeck allow us to guess the future card
  static newWithDebug(
    playerIds: string[], playerHandCount: number[],
    customDeck: Card[],
  ): Match {
    const match = new Match();
    match.init(playerIds, playerHandCount, customDeck);
    match.init2CardEachHand()
    return match;
  }

  playerHit(handIdx: number) {
    // validate

    // --
    const hand = this.hands[handIdx];
    // const card: Card = TODO;
    // hand.hit(card)
  }

  playerStay(handIdx: number) {
    // validate

    // then
    const hand = this.hands[handIdx];
    hand.stay();
  }

  /**
   *
   * @param playerIds
   * @param playerHandCount 1 user can have multiple hands
   * @param customDeck with predefined deck, good for unit-test
   * @private
   */
  private init(playerIds: string[], playerHandCount: number[], customDeck?: Card[]) {
    if (!customDeck) {
      // new shuffled 52 cards deck
      const decks = [0, 1, 2, 3, 4, 5].map(i => this.gen52CardsDeck(i));
      // shuffle the deck
      this.deck = decks.flat().sort(() => Math.random() - 0.5);
    } else {
      this.deck = customDeck;
    }


    // create empty hands for players, dealer is player 0
    let handIdx = 0
    this.hands = playerIds.map((i, idx) => {
      const hands: Hand[] = []
      for (let j = 0; j < playerHandCount[idx]; j++) {
        hands.push(new Hand(handIdx, i))
        handIdx++
      }
      return hands;
    }).flat()
    this.status = MatchStatus.Playing

    // player will play first
  }

  // For debug + unit test only
  // public debugSetDeck(deck: Card[]) {
  //   this.deck = deck
  // }

  private init2CardEachHand() {
    for (let i = 0, c = this.hands.length; i < c; i++) {
      const hand = this.hands[i];
      let c = this.deck.pop()
      c && hand.unsafeAddCard(c)
      c = this.deck.pop()
      c && hand.unsafeAddCard(c)
    }
  }

  // When all the player hands is stay, it's dealer turn
  private isDealerTurn(): boolean {
    return false; // TODO
  }

  private gen52CardsDeck(deckIdx: number): Card[] {
    const cards: Card[] = [];
    const faces = ["A", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    const vars = [CardVariant.Heart, CardVariant.Diamond, CardVariant.Club, CardVariant.Spade];
    for (let fi = 0, c = faces.length; fi < c; fi++) {
      for (let vi = 0, c = vars.length; vi < c; vi++) {
        cards.push(getCard(faces[fi], vars[vi], deckIdx));
      }
    }

    return cards;
  }
}
