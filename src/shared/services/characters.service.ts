import { AxiosResponse } from 'axios';
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
        convertToWithCharacterWithId
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

const convertToWithCharacterWithId = (
  character: CharacterWithUrl
): Character => {
  const urlSplit = character.url?.split('/');
  delete character.url;

  const result: Character = {
    ...character,
    id: parseInt(urlSplit ? urlSplit[urlSplit.length - 1] : '0'),
  };

  return result;
};
