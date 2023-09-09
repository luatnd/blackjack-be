import InMemDb from "../in-mem-db";
import { MatchDto } from "../db-collection/Matchs";
import { Dao } from "./dao";
import cloneDeep from 'lodash.clonedeep'

export class MatchDao implements Dao<MatchDto> {
  insert(item: MatchDto) {
    return this.update(item)
  }
  get(id: string): MatchDto | undefined {
    if (!(id in InMemDb.matches)) {
      return undefined;
    }

    return cloneDeep(InMemDb.matches[id]);
  }

  update(item: MatchDto) {
    // store indexes
    // i=1: skip dealer
    for (let i = 1, c = item.hands.length; i < c; i++) {
      const hand = item.hands[i];
      InMemDb.matches_index__Player_LastMatch[hand.playerId ?? ""] = item.id;
    }

    InMemDb.matches[item.id] = cloneDeep(item);

    return item
  }

  delete(id: string): boolean {
    const item = InMemDb.matches[id]
    if (!item) return false

    // i=1: skip dealer
    for (let i = 1, c = item.hands.length; i < c; i++) {
      const hand = item.hands[i];
      delete InMemDb.matches_index__Player_LastMatch[hand.playerId ?? ""];
    }

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
