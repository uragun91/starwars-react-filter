import TextField from '@mui/material/TextField';
import React, { useRef, useState } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import styles from './CharacterPage.module.css';
import classnames from 'classnames';

import { useAppDispatch } from '../../../../store/hooks';
import {
  getCharacterById,
  selectCharacterById,
  selectCurrentCharacter,
  setCurrentCharacter,
} from '../../charactersSlice';
import { Character } from '../../models/character.model';
import { Container } from '@mui/system';
import {
  Avatar,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';

export const CharacterPage = () => {
  let { id: characterId } = useParams();
  const charIdRef = useRef(parseInt(characterId as string));

  const defaultSelectValue = useRef('n/a');

  const dispatch = useAppDispatch();
  const characterFromStore: Character | undefined = useSelector(
    selectCharacterById(charIdRef.current)
  );
  const currentCharacter: Character | null = useSelector(
    selectCurrentCharacter
  );

  const [character, setCharacter] = useState<Character | null>();

  const [name, setName] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [hairColor, setHairColor] = useState('');
  const [gender, setGender] = useState('');
  const [skinColor, setSkinColor] = useState('');

  useEffect(() => {
    if (character) {
      setName(character.name);
      setBirthYear(character.birth_year);
      setHairColor(character.hair_color);
      setGender(character.gender);
      setSkinColor(character.skin_color);
    }
  }, [character]);

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
      <div className={classnames(styles.section, styles.sectionHeader)}>
        <Container fixed>
          <Avatar
            alt={character?.name}
            src={character?.img}
            variant="rounded"
            sx={{
              width: 200,
              height: 300,
              border: '3px solid white',
              position: 'relative',
              top: 140,
            }}
          />
        </Container>
      </div>
      <Container fixed>
        <Box className={styles.formContainer}>
          <div className={styles.infoWrapper}>
            <Typography
              variant="h5"
              className={styles.infoTitle}
              sx={{ mb: 2 }}
            >
              Personal Data
            </Typography>
            <Box marginBottom={2}>
              <TextField
                size="small"
                fullWidth
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                label="Name"
                InputLabelProps={{ shrink: true }}
                InputProps={{ readOnly: true }}
              />
            </Box>
            <Box marginBottom={2}>
              <TextField
                size="small"
                fullWidth
                value={birthYear}
                onChange={(e) => {
                  setBirthYear(e.target.value);
                }}
                label="Date of birth"
                InputLabelProps={{ shrink: true }}
                InputProps={{ readOnly: true }}
              />
            </Box>
            <Box marginBottom={2}>
              <FormControl fullWidth size="small">
                <InputLabel id="gender-label">Geneder</InputLabel>
                <Select
                  labelId="gender-label"
                  defaultValue={defaultSelectValue.current}
                  id="gender"
                  value={gender}
                  label="Gender"
                  onChange={(e) => {
                    setGender(e.target.value);
                  }}
                >
                  <MenuItem value={'n/a'}>N/A</MenuItem>
                  <MenuItem value={'male'}>Male</MenuItem>
                  <MenuItem value={'female'}>Female</MenuItem>
                  <MenuItem value={'hermaphrodite'}>Hermaphrodite</MenuItem>
                  <MenuItem value={'none'}>None</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box marginBottom={2}>
              <FormControl fullWidth size="small">
                <InputLabel id="hair-color-label">Hair Color</InputLabel>
                <Select
                  labelId="hair-color-label"
                  defaultValue={defaultSelectValue.current}
                  id="hair-color"
                  value={hairColor}
                  label="Hair color"
                  onChange={(e) => {
                    setHairColor(e.target.value);
                  }}
                >
                  <MenuItem value={'n/a'}>N/A</MenuItem>
                  <MenuItem value={'auburn, grey'}>Auburn, Grey</MenuItem>
                  <MenuItem value={'auburn'}>Auburn</MenuItem>
                  <MenuItem value={'blond'}>Blonde</MenuItem>
                  <MenuItem value={'brown'}>Brown</MenuItem>
                  <MenuItem value={'dark'}>Dark</MenuItem>
                  <MenuItem value={'bold'}>Bold</MenuItem>
                  <MenuItem value={'white'}>White</MenuItem>
                  <MenuItem value={'grey'}>Grey</MenuItem>
                  <MenuItem value={'black'}>Black</MenuItem>
                  <MenuItem value={'none'}>None</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box>
              <FormControl fullWidth size="small">
                <InputLabel id="skin-color-label">Skin Color</InputLabel>
                <Select
                  labelId="skin-color-label"
                  id="skin-color"
                  defaultValue={defaultSelectValue.current}
                  value={skinColor}
                  label="Skin color"
                  onChange={(e) => {
                    setSkinColor(e.target.value);
                  }}
                >
                  <MenuItem value={'n/a'}>N/A</MenuItem>
                  <MenuItem value={'gold'}>Gold</MenuItem>
                  <MenuItem value={'metal'}>Metal</MenuItem>
                  <MenuItem value={'fair'}>Fair</MenuItem>
                  <MenuItem value={'brown'}>Brown</MenuItem>
                  <MenuItem value={'unknown'}>Unknown</MenuItem>
                  <MenuItem value={'green'}>Green</MenuItem>
                  <MenuItem value={'dark'}>Dark</MenuItem>
                  <MenuItem value={'light'}>Light</MenuItem>
                  <MenuItem value={'brown mottle'}>Brown Mottle</MenuItem>
                  <MenuItem value={'green-tan, brown'}>
                    Green-tan, brown
                  </MenuItem>
                  <MenuItem value={'pale'}>Pale</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </div>

          {Boolean(
            character?.starships.length || character?.vehicles.length
          ) ? (
            <div className={styles.infoWrapper}>
              <Typography
                variant="h5"
                component="h5"
                className={styles.infoTitle}
                sx={{ mb: 2 }}
              >
                Vehicles & Starships
              </Typography>
            </div>
          ) : (
            ''
          )}
        </Box>
      </Container>
    </div>
  );
};
