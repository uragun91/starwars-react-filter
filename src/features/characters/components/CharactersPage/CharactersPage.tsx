import React, { useCallback } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../../store/hooks';
import {
  getListOfCharacters,
  selectCharacters,
  selectFilter,
  selectPage,
  selectTotal,
  setFilter,
} from '../../charactersSlice';

import styles from './CharactersPage.module.css';

import debounce from 'lodash.debounce';
import { CharacterCard } from '../CharacterCard/CharacterCard';
import { Container } from '@mui/material';

export const CharactersPage = () => {
  const dispatch = useAppDispatch();

  const filter = useSelector(selectFilter);
  const page = useSelector(selectPage);
  const total = useSelector(selectTotal);

  const characters = useSelector(selectCharacters);

  // load list of characters
  useEffect(() => {
    dispatch(getListOfCharacters(page, filter));
  }, [page, filter, dispatch]);

  const changeHandler = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      const input = e.target as HTMLInputElement;
      dispatch(setFilter(input.value));
    },
    [dispatch]
  );

  const debouncedChangeHandler = useCallback(debounce(changeHandler, 300), [
    changeHandler,
  ]);

  return (
    <>
      <Container fixed>
        <div>Characters Page</div>
        <input type="text" onChange={debouncedChangeHandler} />
        <div>Total is: {total}</div>
        <div>Filter is: {filter}</div>
        <div className={styles.cardsContainer}>
          {characters.map((character) => {
            return (
              <CharacterCard
                key={character.id}
                character={character}
              ></CharacterCard>
            );
          })}
        </div>
      </Container>
    </>
  );
};
