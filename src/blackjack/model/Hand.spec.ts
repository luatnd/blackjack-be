import { Hand } from "./Hand";
import { CardVariant, getCard } from "./Card";
import { HandStatus } from "../datasource/db-collection/Matchs";

describe("Hand point", () => {
  const V = CardVariant

  it("point without Ace", () => {
    const h = new Hand(1);
    h.hit(getCard("1", V.Heart, 0))
    h.hit(getCard("J", V.Heart, 0))
    h.hit(getCard("Q", V.Heart, 0))

    expect(h.point).toEqual(21)
  });

  it("point with Ace", () => {
    const h = new Hand(1);
    h.hit(getCard("J", V.Heart, 0))
    h.hit(getCard("A", V.Heart, 0))

    expect(h.point).toEqual(21)
  });

  it("point with Aces", () => {
    const h = new Hand(1);
    h.hit(getCard("J", V.Heart, 0))
    h.hit(getCard("A", V.Heart, 0))
    expect(() => {
      h.hit(getCard("A", V.Heart, 1))
    }).toThrow()

    expect(h.point).toEqual(21)
  });

  it("point with Aces 2", () => {
    const h = new Hand(1);
    h.hit(getCard("7", V.Heart, 0))
    h.hit(getCard("A", V.Heart, 0))
    h.hit(getCard("A", V.Heart, 1))
    h.hit(getCard("6", V.Heart, 0))
    h.hit(getCard("A", V.Heart, 2))
    h.hit(getCard("1", V.Heart, 0))
    h.hit(getCard("1", V.Heart, 0))

    expect(h.point).toEqual(18)
  });

  it("point with Aces 3", () => {
    const h = new Hand(1);
    h.hit(getCard("J", V.Heart, 0))
    h.hit(getCard("Q", V.Heart, 0))
    h.hit(getCard("A", V.Heart, 0))

    expect(h.point).toEqual(21)
  });
});


describe("Hand status", () => {
  const V = CardVariant

  it("Hit, BlackJack, Throw", () => {
    const h = new Hand(1);
    h.hit(getCard("1", V.Heart, 0))
    expect(h.status).toEqual(HandStatus.Hit)

    h.hit(getCard("J", V.Heart, 0))
    expect(h.status).toEqual(HandStatus.Hit)

    h.hit(getCard("Q", V.Heart, 0))
    expect(h.status).toEqual(HandStatus.BlackJack)

    expect(() => {
      h.hit(getCard("A", V.Heart, 0))
    }).toThrow()
  });

  it("Burst", () => {
    const h = new Hand(1);
    h.hit(getCard("6", V.Heart, 0))
    expect(h.status).toEqual(HandStatus.Hit)

    h.hit(getCard("J", V.Heart, 0))
    expect(h.status).toEqual(HandStatus.Hit)

    h.hit(getCard("Q", V.Heart, 0))
    expect(h.status).toEqual(HandStatus.Burst)
  });

  it("Stay", () => {
    const h = new Hand(1);
    h.hit(getCard("6", V.Heart, 0))
    h.stay()
    expect(h.status).toEqual(HandStatus.Stay)
  });

});
