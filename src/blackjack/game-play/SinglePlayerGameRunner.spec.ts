import { SinglePlayerGameRunner } from "./SinglePlayerGameRunner";
import { HandStatus, MatchStatus } from "../datasource/db-collection/Matchs";
import { DEALER_ID } from "../datasource/dao/Player.dao";
import { CardVariant } from "./Card";
import { Match } from "./Match";
import { sleep } from "../../utils/time";

describe('SinglePlayerGameRunner', () => {
  const V = CardVariant;

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

    // clean last game of this user
    SinglePlayerGameRunner.cleanMatch(player.id);

    const customDeck = Match.newDeckWithCards([
      // face, var, deck
      // dealer
      ["1", V.Spade, 0],
      ["8", V.Spade, 0],
      // player
      ["1", V.Spade, 0],
      ["A", V.Spade, 1],
      // rest
      ["1", V.Spade, 1],
      ["1", V.Club, 1],
      ["1", V.Diamond, 1],
      ["1", V.Heart, 1],
      ["1", V.Spade, 2],
      ["1", V.Club, 2],
      ["1", V.Diamond, 2],
      ["1", V.Heart, 2],

      ["J", V.Heart, 0],
    ]);

    // first api request
    const game = new SinglePlayerGameRunner(0, player.name, player.id);
    game.debugReInitMatch(customDeck)

    game.hit()
    expect(game.lastMatch.hands[1].point).toEqual(13)


    // 2nd request
    const gameReq2 = new SinglePlayerGameRunner(0, player.name, player.id);
    expect(gameReq2.player.name).toEqual(player.name)
    expect(gameReq2.lastMatch).toBeDefined()
    gameReq2.hit()
    expect(gameReq2.lastMatch.hands[1].point).toEqual(14)

    // 3rd request
    const gameReq3 = new SinglePlayerGameRunner(0, player.name, player.id);
    expect(gameReq3.player.name).toEqual(player.name)
    expect(gameReq3.lastMatch.hands[1].point).toEqual(14)
    gameReq3.stay()
    expect(gameReq3.lastMatch.hands[1].point).toEqual(14)
    expect(gameReq3.lastMatch.hands[1].status).toEqual(HandStatus.Win)
    expect(gameReq3.lastMatch.hands[0].status).toEqual(HandStatus.Burst)
    expect(gameReq3.lastMatch.hands[0].point).toEqual(25)
  });

  it('can correctly store to in-mem db', () => {
    const player = {id: "1", name: "Debby"}

    // clean last game of this user
    SinglePlayerGameRunner.cleanMatch(player.id);

    const customDeck = Match.newDeckWithCards([
      // face, var, deck
      // dealer
      ["1", V.Spade, 0],
      ["8", V.Spade, 0],
      // player
      ["1", V.Spade, 0],
      ["A", V.Spade, 1],
      // rest
      ["1", V.Spade, 1],
      ["1", V.Club, 1],
      ["1", V.Diamond, 1],
      ["1", V.Heart, 1],
      ["1", V.Spade, 2],
      ["1", V.Club, 2],
      ["1", V.Diamond, 2],
      ["1", V.Heart, 2],

      ["J", V.Heart, 0],
    ]);

    // first api request
    const game = new SinglePlayerGameRunner(0, player.name, player.id);
    game.debugReInitMatch(customDeck)

    game.hit()
    expect(game.lastMatch.hands[1].point).toEqual(13)

    const lastMatch = game.matchDao.findByPlayerId(player.id);
    expect(lastMatch!.hands[1].cards[2].value).toEqual(1)
  })

  it('delay should work', async () => {
    const player = {id: "1", name: "Debby"}
    const game = new SinglePlayerGameRunner(1, player.name, player.id);
    if (game.lastMatch.hands[1].status != HandStatus.BlackJack) {
      game.hit()
    }
    game.stay() // finish match

    await sleep(500)
    expect(() => game.newMatch()).toThrow(`Need to wait 1 seconds between each round`)

    await sleep(1500)
    const oldMatchId = game.lastMatch.id;

    game.newMatch()
    const newMatchId = game.lastMatch.id;
    expect(newMatchId != oldMatchId).toBeTruthy()
  })

  it('can handle concurrency while multiple user are playing', () => {
    const player = {id: "1", name: "Debby"}
    const player2 = {id: "2", name: "Alice"}

    const game = new SinglePlayerGameRunner(1, player.name, player.id);
    const game2 = new SinglePlayerGameRunner(1, player2.name, player2.id);
    const game3 = new SinglePlayerGameRunner(1, player2.name, player2.id); // will throw error if game 2 blackjack
    game.stay()
    game3.stay()

    expect(game.lastMatch.id != game3.lastMatch.id).toBeTruthy()
  })
});
