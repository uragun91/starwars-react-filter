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
}

const initialState: CharactersState = {
  currentPage: 1,
  total: 0,
  filter: '',
  characters: [],
  currentCharacter: null,
  isLoadingList: false,
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
  },
});

export const {
  setPage,
  setFilter,
  setCharacters,
  setTotal,
  setCurrentCharacter,
  setIsLoadingList,
} = charactersSlice.actions;

// Selectors
export const selectFilter = (state: RootState) => state.characters.filter;

export const selectPage = (state: RootState) => state.characters.currentPage;

export const selectTotal = (state: RootState) => state.characters.total;

export const selectIsLoadingList = (state: RootState) =>
  state.characters.isLoadingList;

export const selectCharacters = (state: RootState) =>
  state.characters.characters;

export const selectCharacterById = (
  id: number
): ((state: RootState) => Character | undefined) => {
  return (state: RootState) =>
    state.characters.characters.find((character) => character.id === id);
};

export const selectCurrentCharacter = (state: RootState) =>
  state.characters.currentCharacter;

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

export default charactersSlice.reducer;
