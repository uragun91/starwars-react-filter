import { Gender } from '../../../shared/models/gender.enum';

export interface Character {
  id: number;
  name: string;
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  gender: Gender;
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
