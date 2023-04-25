import {
  Character,
  CharactersResponse,
  CharacterWithUrl,
} from '../../features/characters/models/character.model';
import { http } from '../axios';
import { QueryParams } from '../models/query-params.model';

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

const matchSingleCharacterFormLocalStorage = (
  character: Character
): Character => {
  try {
    const lsCharacters: Array<{ id: number } & Partial<Character>> = JSON.parse(
      localStorage.getItem('characters') as string
    );
    if (Array.isArray(lsCharacters)) {
      const matchedChar = lsCharacters.find(
        (lsChar) => lsChar.id === character.id
      );

      if (matchedChar) {
        return { ...character, ...matchedChar };
      }

      return character;
    }
  } catch (e) {
    // just suppress an error and return characters as is
  }

  return character;
};

const matchCharsFromLocalStorage = (characters: Character[]): Character[] => {
  try {
    const lsCharacters: Array<{ id: number } & Partial<Character>> = JSON.parse(
      localStorage.getItem('characters') as string
    );
    if (Array.isArray(lsCharacters)) {
      const updatedCharacters = characters.map((char) => {
        const matchedCharacter = lsCharacters.find(
          (lsChar) => lsChar.id === char.id
        );

        if (matchedCharacter) {
          return { ...char, ...matchedCharacter };
        }

        return char;
      });

      return updatedCharacters;
    }
  } catch (e) {
    // just suppress an error and return characters as is
  }

  return characters;
};

const loadListOfCharacters = (
  page = 1,
  filter = ''
): Promise<CharactersResponse<Character>> => {
  const params: QueryParams = {
    page,
  };

  if (filter) {
    params.search = filter;
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
    })
    .then((charactersResponse) => {
      charactersResponse.results = matchCharsFromLocalStorage(
        charactersResponse.results
      );

      return charactersResponse;
    });
};

const loadCharacterById = (id: number): Promise<Character> => {
  return http
    .get<CharacterWithUrl>(`/people/${id}`)
    .then((response) => {
      return response.data;
    })
    .then(convertToOrdinaryCharacter)
    .then(matchSingleCharacterFormLocalStorage);
};

const saveCharacterToLocalStorage = (character: Character): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const lsCharacters: Array<{ id: number } & Partial<Character>> =
          JSON.parse(localStorage.getItem('characters') as string);

        if (Array.isArray(lsCharacters)) {
          lsCharacters.push(character);
          localStorage.setItem('characters', JSON.stringify(lsCharacters));
        }
      } catch (e) {
        // suppress error
      }

      resolve();
    }, 1500);
  });
};

export const charactersService = {
  loadListOfCharacters,
  loadCharacterById,
  saveCharacterToLocalStorage,
};
