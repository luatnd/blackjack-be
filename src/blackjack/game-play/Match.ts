import { HandStatus, MatchDto, MatchStatus } from "../datasource/db-collection/Matchs";
import { Hand } from "./Hand";
import { Card, CardVariant, getCard } from "./Card";
import { nanoid6 } from "../datasource/NanoId";

type CardLike = [face: string, variant: CardVariant, deckIdx: number];

/*
  This BlackJack Match support multiple hands (eg: 6 hands)
  1 match n hands
  1 player can have n hands
 */
export class Match {
  hands: Hand[] = []; // NOTE: Dealer hand is always at 0
  deck: Card[] = [];
  status: MatchStatus = MatchStatus.PlayersTurn;

  stopAt: number;
  id: string;

  // prevent this entry point
  private constructor() {}

  static from(dto: MatchDto): Match {
    const match = new Match();
    match.id = dto.id;
    match.deck = [...dto.deck];
    match.hands = dto.hands.map(i => Hand.from(i));
    match.status = dto.status;
    match.stopAt = dto.stopAt;

    return match;
  }

  static toDto(m: Match): MatchDto {
    return {
      id: m.id,
      deck: [...m.deck],
      hands: m.hands.map(i => Hand.to(i)),
      status: m.status,
      stopAt: m.stopAt,
    }
  }

  static new(playerIds: string[], playerHandCount: number[]): Match {
    const match = new Match();
    match.init(playerIds, playerHandCount);
    match.init2CardEachHand()
    match.evalDealerTurn() // try to eval after init because: if all user is blackjack then they cannot hit anymore
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
    match.evalDealerTurn() // try to eval after init because: if all user is blackjack then they cannot hit anymore
    return match;
  }

  /**
   * @param handIdx which hand is playing, because of Match support multi hands
   */
  playerHit(handIdx: number): Hand {
    // validate
    // - only can hit if status is still hit
    if (handIdx >= this.hands.length) {
      throw new Error(`handIdx out of range: current hands len = ${this.hands.length}`)
    }
    const hand = this.hands[handIdx];
    if (hand.wasStoppedAndWaitingDealerTurn()) {
      throw new Error(`Hand is stop and waiting for dealer`)
    }

    // --
    const card = this.pickCardFromDeck();
    hand.hit(card)

    // eval: when no more this hand turns, see HandStatus
    if (hand.status === HandStatus.Burst) {
      this.onHandBurst(handIdx)
    } else if (hand.wasStoppedAndWaitingDealerTurn()) {
      this.onHandStop(handIdx)
    }

    // after all evaluation
    // Match might be stopped
    return hand
  }

  /**
   * @param handIdx which hand is playing, because of Match support multi hands
   */
  playerStay(handIdx: number) {
    // validate
    if (handIdx >= this.hands.length) {
      throw new Error(`handIdx out of range: current hands len = ${this.hands.length}`)
    }
    const hand = this.hands[handIdx];
    hand.stay();

    if (hand.wasStoppedAndWaitingDealerTurn()) {
      this.onHandStop(handIdx)
    }

    return hand
  }

  /**
   *
   * @param playerIds
   * @param playerHandCount 1 user can have multiple hands
   * @param customDeck with predefined deck, good for unit-test
   * @private
   */
  private init(playerIds: string[], playerHandCount: number[], customDeck?: Card[]) {
    this.id = nanoid6();

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
    this.status = MatchStatus.PlayersTurn

    // player will play first
  }

  // For debug + unit test only
  // public debugSetDeck(deck: Card[]) {
  //   this.deck = deck
  // }

  private init2CardEachHand() {
    for (let i = 0, c = this.hands.length; i < c; i++) {
      const hand = this.hands[i];
      hand.hit(this.pickCardFromDeck())
      hand.hit(this.pickCardFromDeck())
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

  private pickCardFromDeck(): Card {
    const c = this.deck.pop()
    if (!c) {
      throw new Error(`deck ran out of cards`)
    }
    return c
  }

  private onHandBurst(handIdx: number) {
    this.evalDealerTurn()
  }

  // Hand stop mean player stop turn, waiting for dealer
  private onHandStop(handIdx: number) {
    this.evalDealerTurn()
  }

  // check if it dealer turn then continue to dealer turn
  // Dealer turn is all user is not hit anymore
  private evalDealerTurn() {
    // revalidate status if no more player hit
    const allPlayerStopped = this.hands.reduce((acc, i) => {
      return i.isDealer() ? true : acc && i.stopped;
    }, true)

    if (!allPlayerStopped) return;

    // --- start dealer turn
    this.status = MatchStatus.DealerTurn;

    const h = this.hands[0]
    if (!h.isDealer()) {
      throw new Error("Hand0 is not dealer, this cannot be happen")
    }

    while (h.point < 17) {
      h.hit(this.pickCardFromDeck())
    }

    this.evalMatch()
  }

  /**
   * Stop the match and eval who win or lose
   */
  private evalMatch() {
    const dealerHand = this.hands[0];
    const dealerP = dealerHand.point;
    // console.log('{evalMatch} dealerP: ', dealerP, dealerHand);

    for (let i = 1, c = this.hands.length; i < c; i++) {
      const playerHand = this.hands[i];

      if (!playerHand.wasStoppedAndWaitingDealerTurn()) return;

      // rule
      // - who burst then lose, no matter other user is, but user always burst first
      // - user blackjack but dealer blackjack too => Draw
      // - if no one burst, who large will win, or draw if equal

      // user burst: if playerHand.status = Burst then already final result
      if (playerHand.status === HandStatus.Burst) {}
      // dealer burst: => win
      else if (dealerHand.status === HandStatus.Burst) {
        playerHand.status = (playerHand.status === HandStatus.BlackJack)
          ? HandStatus.WinBlackJack
          : HandStatus.Win;
      }
      // both black jack
      else if (playerHand.status === HandStatus.BlackJack && dealerHand.status === HandStatus.BlackJack) {
        playerHand.status = HandStatus.Draw;
      }
      // who larger win
      else {
        const p = playerHand.point;
        playerHand.status =
            p < dealerP ? HandStatus.Lose
          : p == dealerP ? HandStatus.Draw
          : (
            playerHand.status === HandStatus.BlackJack
              ? HandStatus.WinBlackJack
              : HandStatus.Win
          );
      }
    }

    this.status = MatchStatus.Completed
    this.stopAt = Date.now()
  }

  // for unit test only
  static newDeckWithCards(cardLikeArr: CardLike[]): Card[] {
    return cardLikeArr.map(i => getCard(...i)).reverse(); // FILO => FIFO
  }
}
