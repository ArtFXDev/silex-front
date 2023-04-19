import { Person } from "./Person";

export interface GameVariant {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  color: string | null;
  title: string;
  price: number;
  game_id: string;
  preview_file_id: null;
  game: Game;
  owners: Person[];
  badge: string | null;

  type: "GameVariant";
}

export interface Game {
  scores: [];
  variants: GameVariant[];
  id: string;
  created_at: "2022-05-03T10:04:10";
  updated_at: "2022-05-03T10:04:10";
  name: string;
  type: "Game";
}

export interface GameScore {
  id: string;
  created_at: string;
  updated_at: string;
  points: number;
  player_id: string;
  game_id: string;
  type: "GameScore";

  player: Person;
}
