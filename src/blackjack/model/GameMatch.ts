import {HandDto, MatchStatus} from "../datasource/db-collection/Matchs";

export type GameMatch = {
  id: string,
  dealerHand: HandDto,
  playerHand: HandDto,
  player: { id: string, name: string },
  status: MatchStatus,
  stopAt: number,
  error?: string,
  delay?: number, // delay between match in seconds
}
