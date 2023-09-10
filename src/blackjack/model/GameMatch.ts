import {HandDto, MatchStatus} from "../datasource/db-collection/Matchs";

export type GameMatch = {
  dealerHand: HandDto,
  playerHand: HandDto,
  status: MatchStatus,
  stopAt: number,
}
