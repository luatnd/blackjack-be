import { Card } from "../../game-play/Card";

type Id = string;
type PlayerId = string

export enum HandStatus {
  // Playing status
  Hit = "Hit",

  // Waiting dealer
  Stay = "Stay",
  BlackJack = "BlackJack",
  Burst = "Burst",  // lose by Burst // also a final status

  // final status via eval with dealer
  Win = "Win",      // normal win
  WinBlackJack = "WinBlackJack", // win by BlackJack
  Draw = "Draw",    // draw by same point or same blackjack
  Lose = "Lose",    // lose by lesser point
}
export type HandDto = {
  playerId?: string, // 1 player can have n hands
  handIdx: number;
  cards: Card[],
  status: HandStatus,
}
export enum MatchStatus {PlayersTurn, DealerTurn, Completed}

export type MatchDto = {
  id: string,
  hands: HandDto[],
  deck: Card[],
  status: MatchStatus,
  stopAt: number, // last stop = unix ts in milli-secs
}

export type Matches = Record<Id, MatchDto>;
export type Matches_index__Player_LastMatch = Record<PlayerId, Id>;
