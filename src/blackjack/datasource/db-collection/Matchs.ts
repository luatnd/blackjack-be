import { Card } from "../../model/Card";

type Id = string;
type PlayerId = string

export enum HandStatus {Hit, Stay, Lose, Win, Draw}
export type HandDto = {
  playerId?: string, // 1 player can have n hands
  handIdx: number;
  cards: Card[],
  status: HandStatus,
}
export enum MatchStatus {Playing, UserWon, UserLose, Draw, }

export type MatchDto = {
  id: string,
  hands: HandDto[],
  deck: Card[],
  status: MatchStatus,
}

export type Matches = Record<Id, MatchDto>;
export type Matches_index__Player_LastMatch = Record<PlayerId, Id>;
