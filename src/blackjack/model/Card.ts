export enum CardVariant {Heart, Diamond, Club, Spade,}
export type Card = {
  face: string,
  value?: number, // the value of this card in blackjack game only
  value2?: number, // the value of this card in blackjack game only
  variant: CardVariant,
  deck: number, // 52 cards from 6 decks, so we will have 6 same card
}
