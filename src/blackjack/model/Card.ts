export enum CardVariant {Heart, Diamond, Club, Spade,}
export type Card = {
  face: string,
  value: number, // the value of this card in blackjack game only
  value2?: number, // the value of this card in blackjack game only
  variant: CardVariant,
  deck?: number, // 312 cards from 6 decks, so we will have 6 same card
}

export function getCard(face: string, variant: CardVariant, deck: number): Card {
  const fi = parseInt(face)
  let value
  if (isNaN(fi)) {
    value = face == "A" ? 1 : 10;
  } else {
    value = (1 <= fi && fi <= 10) ? fi
      : (fi == 0) ? 1
        : 10;
  }

  const value2 = face == "A" ? 11 : undefined; // Ace can be 1 or 11

  return {
    deck,
    face,
    variant,
    value,
    value2
  }
}
