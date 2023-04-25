import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Character } from './models/character.model';
import { AppDispatch, RootState } from '../../store/store';
import { charactersService } from '../../shared/services/characters.service';

export interface CharactersState {
  currentPage: number;
  total: number;
  filter: string;
  characters: Character[];
  currentCharacter: Character | null;
  isLoadingList: boolean;
  isSavingCharacter: boolean;
}

const initialState: CharactersState = {
  currentPage: 1,
  total: 0,
  filter: '',
  characters: [],
  currentCharacter: null,
  isLoadingList: false,
  isSavingCharacter: false,
};

export const charactersSlice = createSlice({
  name: 'characters',
  initialState,
  reducers: {
    setPage: (state: CharactersState, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setFilter: (state: CharactersState, action: PayloadAction<string>) => {
      state.filter = action.payload;
    },
    setTotal: (state: CharactersState, action: PayloadAction<number>) => {
      state.total = action.payload;
    },
    setIsLoadingList: (
      state: CharactersState,
      action: PayloadAction<boolean>
    ) => {
      state.isLoadingList = action.payload;
    },
    setCharacters: (
      state: CharactersState,
      action: PayloadAction<Character[]>
    ) => {
      state.characters = action.payload;
    },
    setCurrentCharacter: (
      state: CharactersState,
      action: PayloadAction<Character>
    ) => {
      state.currentCharacter = action.payload;
    },
    setIsSavingCharacter: (
      state: CharactersState,
      action: PayloadAction<boolean>
    ) => {
      state.isSavingCharacter = action.payload;
    },
    setCharacterById: (
      state: CharactersState,
      action: PayloadAction<Character>
    ) => {
      const characterIndex = state.characters.findIndex(
        (char) => char.id === action.payload.id
      );
      if (characterIndex > -1) {
        state.characters[characterIndex] = action.payload;
      }
    },
  },
});

export const {
  setPage,
  setFilter,
  setCharacters,
  setTotal,
  setCurrentCharacter,
  setIsLoadingList,
  setCharacterById,
  setIsSavingCharacter,
} = charactersSlice.actions;

// Selectors
export const selectFilter = (state: RootState) => state.characters.filter;

export const selectPage = (state: RootState) => state.characters.currentPage;

export const selectTotal = (state: RootState) => state.characters.total;

export const selectIsLoadingList = (state: RootState) => {
  return state.characters.isLoadingList;
};

export const selectCharacters = (state: RootState) => {
  return state.characters.characters;
};

export const selectCurrentCharacter = (state: RootState) =>
  state.characters.currentCharacter;

export const selectIsSavingCharacter = (state: RootState) => {
  return state.characters.isSavingCharacter;
};

export const selectCharacterById = (
  id: number
): ((state: RootState) => Character | undefined) => {
  return (state: RootState) =>
    state.characters.characters.find((character) => character.id === id);
};

// Async
export const getListOfCharacters =
  (page = 1, filter = '') =>
  (dispatch: AppDispatch) => {
    dispatch(setIsLoadingList(true));

    charactersService
      .loadListOfCharacters(page, filter)
      .then((charactersResponse) => {
        dispatch(setTotal(charactersResponse.count));
        dispatch(setCharacters(charactersResponse.results));
        dispatch(setIsLoadingList(false));
      });
  };

export const getCharacterById = (id: number) => (dispatch: AppDispatch) => {
  charactersService.loadCharacterById(id).then((character) => {
    dispatch(setCurrentCharacter(character));
  });
};

export const saveCharacter =
  (character: Character) => (dispatch: AppDispatch) => {
    dispatch(setIsSavingCharacter(true));
    charactersService.saveCharacterToLocalStorage(character).then(() => {
      dispatch(setCharacterById(character));
      dispatch(setCurrentCharacter(character));
      dispatch(setIsSavingCharacter(false));
    });
  };

export default charactersSlice.reducer;
