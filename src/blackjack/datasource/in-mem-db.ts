import { Matches, Matches_index__Player_LastMatch } from "./db-collection/Matchs";
import { Players } from "./db-collection/Players";

const players: Players = {};
const matches_index__Player_LastMatch: Matches_index__Player_LastMatch = {};
const matches: Matches = {};

export default {
  players,
  matches_index__Player_LastMatch,
  matches
};
