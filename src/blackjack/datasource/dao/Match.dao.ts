import InMemDb from "../in-mem-db";
import { MatchDto } from "../db-collection/Matchs";

export class MatchDao implements Dao<MatchDto> {
  get(id: string): MatchDto | undefined {
    if (!(id in InMemDb.players)) {
      return undefined;
    }

    return InMemDb.matches[id];
  }

  /**
   * A game runner contain some matches,
   * A match contain some players
   */
  findByPlayerId(playerId: string): MatchDto | undefined {
    const matchId = InMemDb.matches_index__Player_LastMatch[playerId];
    return InMemDb.matches[matchId]; // safe in case of matchId=undefined
  }
}
