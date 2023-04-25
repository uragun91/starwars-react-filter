export interface Character {
  id: number;
  img: string;
  name: string;
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  gender: string;
  homeworld: string;
  // urls
  films: string[];
  // urls
  species: string[];
  // urls
  vehicles: string[];
  // urls
  starships: string[];
  // ISO date
  created: string;
  // ISO date
  edited: string;
}

export type CharacterWithUrl = Omit<Character, 'id'> & { url?: string };

export interface CharactersResponse<T> {
  results: T[];
  count: number;
  next: string;
  previous: string;
}
