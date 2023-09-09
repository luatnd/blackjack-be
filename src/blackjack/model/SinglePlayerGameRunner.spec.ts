import { SinglePlayerGameRunner } from "./SinglePlayerGameRunner";
import { HandStatus, MatchStatus } from "../datasource/db-collection/Matchs";
import { DEALER_ID } from "../datasource/dao/Player.dao";
import { CardVariant } from "./Card";
import { Match } from "./Match";

describe('SinglePlayerGameRunner', () => {
  it('can init a clean game', () => {
    const player = {id: "1", name: "Debby"}

    // clean last game of this user
    SinglePlayerGameRunner.cleanMatch(player.id);

    const game = new SinglePlayerGameRunner(0, player.name, player.id);
    expect(game.player.name).toEqual(player.name)
    expect(game.lastMatch).toBeDefined()
    expect(game.lastMatch.deck.length).toBeGreaterThan(0)
    expect(game.lastMatch.hands.length).toEqual(2)
    expect(game.lastMatch.hands[0].playerId).toEqual(DEALER_ID)
    expect(game.lastMatch.hands[1].handIdx).toEqual(1)
    expect(game.lastMatch.hands[1].status).toEqual(HandStatus.Hit)
    expect(game.lastMatch.hands[1].getCards().length).toEqual(2)
  });

  it('hit until burst', () => {
    const V = CardVariant;
    const player = {id: "1", name: "Debby"}

    // clean last game of this user
    SinglePlayerGameRunner.cleanMatch(player.id);
    const game = new SinglePlayerGameRunner(0, player.name, player.id);

    const customDeck = Match.newDeckWithCards([
      // face, var, deck
      // dealer
      ["1", V.Spade, 0],
      ["8", V.Spade, 0],
      // player
      ["A", V.Spade, 0],
      ["A", V.Spade, 1],
      // rest
      ["J", V.Spade, 0],
      ["Q", V.Spade, 0],
      ["K", V.Spade, 0],
    ]);
    game.debugReInitMatch(customDeck)

    // run some hit logic
    game.hit()
    game.hit()
    expect(() => game.hit()).toThrow();
    expect(game.lastMatch.status === MatchStatus.Completed)
    expect(game.lastMatch.hands[1].status === HandStatus.WinBlackJack)
  });

  it('hit and stay', () => {
    const V = CardVariant;
    const player = {id: "1", name: "Debby"}

    // clean last game of this user
    SinglePlayerGameRunner.cleanMatch(player.id);
    const game = new SinglePlayerGameRunner(0, player.name, player.id);

    const customDeck = Match.newDeckWithCards([
      // face, var, deck
      // dealer
      ["1", V.Spade, 0],
      ["8", V.Spade, 0],
      // player
      ["1", V.Spade, 0],
      ["A", V.Spade, 1],
      // rest
      ["3", V.Spade, 0],
      ["4", V.Spade, 0],
      ["K", V.Spade, 0],
    ]);
    game.debugReInitMatch(customDeck)

    // run some hit logic
    game.hit()
    game.hit()
    game.stay()
    expect(() => game.hit()).toThrow();
    expect(game.lastMatch.status === MatchStatus.Completed)
    expect(game.lastMatch.hands[1].status === HandStatus.Draw)
  });


  it('can work between api request', () => {
    const player = {id: "1", name: "Debby"}

    // first api request
    const game = new SinglePlayerGameRunner(0, player.name, player.id);
    expect(game.player.name).toEqual("Debby")
    expect(game.lastMatch).toBeDefined()

    const gameReq2 = new SinglePlayerGameRunner(0, player.name, player.id);
    expect(gameReq2.player.name).toEqual("Debby")
    expect(gameReq2.lastMatch).toBeDefined()
    gameReq2.hit()

    const gameReq3 = new SinglePlayerGameRunner(0, player.name, player.id);
    expect(gameReq3.player.name).toEqual("Debby")
    expect(gameReq3.lastMatch).toBeDefined()
    gameReq3.stay()

    // check the result
    throw new Error("Todo")
  });

  it('can correctly store to in-mem db', () => {
    throw new Error("Todo")
  })

  it('delay should work', () => {
    throw new Error("Todo")
  })
});
