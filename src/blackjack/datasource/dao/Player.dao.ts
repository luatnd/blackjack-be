import InMemDb from "../in-mem-db";
export type PlayerDto = {
  id: string,
  name: string,
}
export const DEALER_ID = "DEALER";

export class PlayerDao implements Dao<PlayerDto> {
  get(id: string): PlayerDto | undefined {
    if (!(id in InMemDb.players)) {
      return undefined;
    }

    return { id, name: InMemDb.players[id] };
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
      InMemDb.players[id] = name
      item = { id, name }
    }

    return item
  }

  // fake player id from name
  deriveIdFromName(name: string) {
    return btoa(name);
  }
}
