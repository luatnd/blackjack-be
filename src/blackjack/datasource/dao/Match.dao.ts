import InMemDb from "../in-mem-db";
import { MatchDto } from "../db-collection/Matchs";
import { Dao } from "./dao";

export class MatchDao implements Dao<MatchDto> {
  insert(item: MatchDto) {
    // TODO
    return item
  }
  get(id: string): MatchDto | undefined {
    if (!(id in InMemDb.players)) {
      return undefined;
    }

    return InMemDb.matches[id];
  }

  update(item: MatchDto) {
    // TODO
    return item
  }

  delete(id: string): boolean {
    delete InMemDb.matches[id];
    return true
  }

  /**
   * A game runner contain some matches,
   * A match contain some players
   */
  findByPlayerId(playerId: string): MatchDto | undefined {
    const matchId = InMemDb.matches_index__Player_LastMatch[playerId];
    return InMemDb.matches[matchId]; // safe in case of matchId=undefined
  }
  deleteByPlayerId(playerId: string): boolean {
    const matchId = InMemDb.matches_index__Player_LastMatch[playerId];
    delete InMemDb.matches_index__Player_LastMatch[playerId];
    return this.delete(matchId)
  }
}
