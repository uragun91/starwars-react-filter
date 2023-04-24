import TextField from '@mui/material/TextField';
import React, { useRef, useState } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import styles from './CharacterPage.module.css';

import { useAppDispatch } from '../../../../store/hooks';
import {
  getCharacterById,
  selectCharacterById,
  selectCurrentCharacter,
  setCurrentCharacter,
} from '../../charactersSlice';
import { Character } from '../../models/character.model';
import { Container } from '@mui/system';
import { Typography } from '@mui/material';

export const CharacterPage = () => {
  let { id: characterId } = useParams();
  const charIdRef = useRef(parseInt(characterId as string));

  const dispatch = useAppDispatch();
  const characterFromStore: Character | undefined = useSelector(
    selectCharacterById(charIdRef.current)
  );
  const currentCharacter: Character | null = useSelector(
    selectCurrentCharacter
  );

  const [character, setCharacter] = useState<Character | null>();

  // if we cannot get character from the store, for example when we reload the page,
  // we should call api to get the character
  useEffect(() => {
    if (characterFromStore) {
      dispatch(setCurrentCharacter(characterFromStore));
      return;
    }

    dispatch(getCharacterById(charIdRef.current));
  }, [characterFromStore, dispatch]);

  // this one is needed to fullfill `character` variable with currentCharacter from the store
  useEffect(() => {
    setCharacter(currentCharacter);
  }, [currentCharacter]);

  return (
    <div className={styles.characterPageWrapper}>
      <Container fixed>
        <div>Name:</div>
        <TextField
          variant="outlined"
          value={character?.name}
          size="small"
          InputProps={{
            readOnly: true,
          }}
        ></TextField>
        <div>Gender: {character?.gender}</div>
        <div>Eyes color: {character?.eye_color}</div>
      </Container>
    </div>
  );
};
