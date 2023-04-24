import SearchIcon from '@mui/icons-material/Search';
import {
  Container,
  InputAdornment,
  Paper,
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
  selectIsLoadingList,
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
  const isLoading = useSelector(selectIsLoadingList);

  const characters = useSelector(selectCharacters);

  // load list of characters
  useEffect(() => {
    dispatch(getListOfCharacters(page, filter));
  }, [page, filter, dispatch]);

  const searchChangeHandler: React.ChangeEventHandler<HTMLInputElement> =
    useCallback(
      (e) => {
        dispatch(setPage(1));
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
        <Typography
          component="h2"
          variant="h3"
          sx={{ mb: 4 }}
          className={styles.header}
        >
          Star wars characters
        </Typography>
        <div className={styles.listControls}>
          <TextField
            sx={{ minWidth: 250 }}
            onChange={debouncedSearchChangeHandler}
            className={styles.searchInput}
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

          <Pagination
            data-testid="paginator"
            count={Math.ceil(total / 10)}
            page={page}
            showFirstButton
            showLastButton
            siblingCount={0}
            size="small"
            onChange={paginationChangeHandler}
          />
        </div>

        <Paper
          sx={{
            visibility:
              isLoading || !Boolean(characters.length) ? 'visible' : 'hidden',
            mb: 3,
            p: 3,
          }}
        >
          {isLoading ? 'Loading...' : 'No characters found'}
        </Paper>

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
