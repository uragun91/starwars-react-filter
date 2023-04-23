import { Character } from '../../features/characters/models/character.model';
import { http } from '../axios';
import { QueryParams } from '../models/query-params.model';

type CharacterWithUrl = Omit<Character, 'id'> & { url?: string };
interface CharactersResponse<T> {
  results: T[];
  count: number;
  next: string;
  previous: string;
}

export const loadListOfCharacters = (
  page = 1,
  filter = ''
): Promise<CharactersResponse<Character>> => {
  const params: QueryParams = {
    page,
  };

  if (filter) {
    params.filter = filter;
  }

  return http
    .get<CharactersResponse<CharacterWithUrl>>('/people', { params })
    .then((charactersResponse) => {
      const characters = charactersResponse.data.results.map(
        convertToOrdinaryCharacter
      );

      const { next, count, previous } = charactersResponse.data;

      return {
        results: characters,
        count,
        next,
        previous,
      };
    });
};

const convertToOrdinaryCharacter = (character: CharacterWithUrl): Character => {
  const urlSplit = character.url?.split('/');
  delete character.url;
  const id = parseInt(urlSplit ? urlSplit[urlSplit.length - 2] : '0');

  const result: Character = {
    ...character,
    img:
      'https://starwars-visualguide.com/assets/img/characters/' + id + '.jpg',
    id: parseInt(urlSplit ? urlSplit[urlSplit.length - 2] : '0'),
  };

  return result;
};
