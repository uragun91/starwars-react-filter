import SearchIcon from '@mui/icons-material/Search';
import {
  Container,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import debounce from 'lodash.debounce';
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
  setPage,
} from '../../charactersSlice';
import { CharacterCard } from '../CharacterCard/CharacterCard';
import styles from './CharactersPage.module.css';
import Pagination from '@mui/material/Pagination';

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

  const searchChangeHandler: React.ChangeEventHandler<HTMLInputElement> =
    useCallback(
      (e) => {
        dispatch(setFilter(e.target.value));
      },
      [dispatch]
    );

  const debouncedSearchChangeHandler = useCallback(
    debounce(searchChangeHandler, 300),
    [searchChangeHandler]
  );

  const paginationChangeHandler = useCallback(
    (event: React.ChangeEvent<unknown>, value: number) => {
      dispatch(setPage(value));
    },
    [dispatch]
  );

  return (
    <div className={styles.charactersWrapper}>
      <Container fixed>
        <Typography variant="h2" component="h2" className={styles.header}>
          Star wars characters
        </Typography>
        <div>
          <TextField
            onChange={debouncedSearchChangeHandler}
            size="small"
            label="Search character"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          {!Boolean(characters.length) ? (
            <Typography className={styles.noCharactersText}>
              No characters found. Please change search string
            </Typography>
          ) : (
            ''
          )}
          <Pagination
            count={Math.ceil(total / 10)}
            page={page}
            showFirstButton
            showLastButton
            size="small"
            onChange={paginationChangeHandler}
          />
        </div>
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
    </div>
  );
};
