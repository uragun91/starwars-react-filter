import LoadingButton from '@mui/lab/LoadingButton';
import {
  Avatar,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import TextField from '@mui/material/TextField';
import { Container } from '@mui/system';
import classnames from 'classnames';
import React, { useCallback, useRef, useState } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Fade from '@mui/material/Fade';

import { useAppDispatch } from '../../../../store/hooks';
import {
  getCharacterById,
  saveCharacter,
  selectCharacterById,
  selectCurrentCharacter,
  selectIsSavingCharacter,
  setCurrentCharacter,
} from '../../charactersSlice';
import { Character } from '../../models/character.model';
import styles from './CharacterPage.module.css';

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
  const isSavingCharacter: boolean = useSelector(selectIsSavingCharacter);

  const [character, setCharacter] = useState<Character | null>();

  const [name, setName] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [hairColor, setHairColor] = useState('');
  const [gender, setGender] = useState('');
  const [skinColor, setSkinColor] = useState('');

  const [editPersonal, setEditPersonal] = useState(false);

  const resetValues = useCallback(() => {
    if (character) {
      setName(character.name);
      setBirthYear(character.birth_year);
      setHairColor(character.hair_color);
      setGender(character.gender);
      setSkinColor(character.skin_color);
    }
  }, [character]);

  const handleSave = useCallback(() => {
    setEditPersonal(false);

    const updatedCharacter: Character = {
      ...(character as Character),
      name,
      birth_year: birthYear,
      hair_color: hairColor,
      gender,
      skin_color: skinColor,
    };

    dispatch(saveCharacter(updatedCharacter));
  }, [character, name, birthYear, hairColor, gender, skinColor, dispatch]);

  useEffect(() => {
    resetValues();
  }, [resetValues]);

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
            <Box
              display={'flex'}
              alignItems={'center'}
              justifyContent={'space-between'}
              mb={2}
            >
              <Typography variant="h5" className={styles.infoTitle}>
                Personal Data
              </Typography>
              <Button
                disabled={isSavingCharacter}
                onClick={() => {
                  if (editPersonal) {
                    resetValues();
                    setEditPersonal(false);
                  } else {
                    setEditPersonal(true);
                  }
                }}
              >
                {editPersonal ? 'Cancel' : 'Edit'}
              </Button>
            </Box>

            <Box marginBottom={2}>
              <TextField
                size="small"
                disabled={!editPersonal}
                fullWidth
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                label="Name"
                InputLabelProps={{ shrink: true }}
              />
            </Box>
            <Box marginBottom={2}>
              <TextField
                size="small"
                disabled={!editPersonal}
                fullWidth
                value={birthYear}
                onChange={(e) => {
                  setBirthYear(e.target.value);
                }}
                label="Date of birth"
                InputLabelProps={{ shrink: true }}
              />
            </Box>
            <Box marginBottom={2}>
              <FormControl fullWidth size="small" disabled={!editPersonal}>
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
              <FormControl fullWidth size="small" disabled={!editPersonal}>
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
            <Box marginBottom={2}>
              <FormControl fullWidth size="small" disabled={!editPersonal}>
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
                  <MenuItem value={'grey'}>Grey</MenuItem>
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
            <Box textAlign={'end'}>
              <LoadingButton
                disabled={!editPersonal}
                loading={isSavingCharacter}
                onClick={handleSave}
              >
                Save
              </LoadingButton>
            </Box>
          </div>
        </Box>
      </Container>
    </div>
  );
};
