import React from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../../store/hooks';
import {
  getListOfCharacters,
  selectCharacters,
  selectFilter,
  selectPage,
} from '../../charactersSlice';

export const CharactersPage = () => {
  const dispatch = useAppDispatch();

  const filter = useSelector(selectFilter);
  const page = useSelector(selectPage);

  const characters = useSelector(selectCharacters);

  // load list of characters
  useEffect(() => {
    dispatch(getListOfCharacters(page, filter));
  }, [page, filter]);

  return (
    <>
      <div>Characters Page</div>
      {characters.map((character) => {
        return <div>{character.name}</div>;
      })}
    </>
  );
};
