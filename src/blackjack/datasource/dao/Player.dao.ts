import InMemDb from "../in-mem-db";
import { Dao } from "./dao";

export type PlayerDto = {
  id: string,
  name: string,
}
export const DEALER_ID = "DEALER";

/**
 * @deprecated No more using because we use auth module from boiler plate
 */
export class PlayerDao implements Dao<PlayerDto> {
  insert(item: PlayerDto) {
    // TODO
    return item;
  }

  get(id: string): PlayerDto | undefined {
    if (!(id in InMemDb.players)) {
      return undefined;
    }

    return { id, name: InMemDb.players[id] };
  }

  update(item: PlayerDto) {
    // TODO
    return item;
  }

  delete(id: string): boolean {
    return false; // TODO
  }


  getPlayerByName(name: string): PlayerDto | undefined {
    const id = this.deriveIdFromName(name);
    return this.get(id);
  }

  public upsertPlayer(name: string): PlayerDto {
    const id = this.deriveIdFromName(name);
    let item = this.get(id);
    if (!item) {
      // register new player
      InMemDb.players[id] = name;
      item = { id, name };
    }

    return item;
  }

  // fake player id from name
  deriveIdFromName(name: string) {
    return btoa(name);
  }
}
