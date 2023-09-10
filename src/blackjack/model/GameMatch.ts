import {HandDto, MatchStatus} from "../datasource/db-collection/Matchs";

export type GameMatch = {
  dealerHand: HandDto,
  playerHand: HandDto,
  player: { id: string, name: string },
  status: MatchStatus,
  stopAt: number,
  error?: string,
}
