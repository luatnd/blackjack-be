import { Match } from "./Match";
import { DEALER_ID } from "../datasource/dao/Player.dao";
import { Card, CardVariant, getCard } from "./Card";
import { HandStatus, MatchStatus } from "../datasource/db-collection/Matchs";

describe("Match", () => {
  const V = CardVariant;

  it("hit burst", () => {
    const customDeck: Card[] = [];
    // dealer
    customDeck.push(getCard("1", V.Spade, 0));
    customDeck.push(getCard("8", V.Spade, 0));
    // player
    customDeck.push(getCard("A", V.Spade, 0));
    customDeck.push(getCard("A", V.Spade, 1));
    // rest
    customDeck.push(getCard("J", V.Spade, 0));
    customDeck.push(getCard("Q", V.Spade, 0));
    customDeck.push(getCard("8", V.Spade, 0))
    customDeck.reverse() // FILO => FIFO

    const match = Match.newWithDebug(
      [DEALER_ID, "1"],
      [1, 1],
      customDeck
    );

    let h;
    h = match.playerHit(1); // J
    expect(match.hands[1].status).toEqual(HandStatus.Hit)

    h = match.playerHit(1); // Q
    // player should Burst now => and stop the match
    expect(match.hands[1].status).toEqual(HandStatus.Burst)
  });

  it("hit BlackJack", () => {
    const customDeck = Match.newDeckWithCards([
      // face, var, deck
      // dealer
      ["1", V.Spade, 0],
      ["8", V.Spade, 0],
      // player
      ["A", V.Spade, 0],
      ["A", V.Spade, 1],
      // rest
      ["9", V.Spade, 0],
      ["Q", V.Spade, 0],
      ["K", V.Spade, 0],
    ]);

    const match = Match.newWithDebug(
      [DEALER_ID, "1"],
      [1, 1],
      customDeck
    );

    const h = match.playerHit(1); // 9♠
    expect(match.hands[1].status).toEqual(HandStatus.WinBlackJack)
    expect(match.status).toEqual(MatchStatus.Completed)
  });

  it("hit stay", () => {
    const customDeck = Match.newDeckWithCards([
      // face, var, deck
      // dealer
      ["1", V.Spade, 0],
      ["8", V.Spade, 0],
      // player
      ["A", V.Spade, 0],
      ["1", V.Spade, 1],
      // rest
      ["2", V.Spade, 0],
      ["Q", V.Spade, 0],
      ["K", V.Spade, 0],
    ]);

    const match = Match.newWithDebug(
      [DEALER_ID, "1"],
      [1, 1],
      customDeck
    );

    const h = match.playerHit(1);
    expect(match.hands[1].status).toEqual(HandStatus.Hit)

    match.playerStay(1);
    expect(match.hands[1].status).toEqual(HandStatus.Lose)
    expect(match.status).toEqual(MatchStatus.Completed)
  });

});
