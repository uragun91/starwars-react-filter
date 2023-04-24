import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { Character } from '../../models/character.model';
import styles from './CharacterCard.module.css';

export const CharacterCard = ({ character }: { character?: Character }) => {
  return (
    <Card sx={{ maxWidth: 220, minWidth: 220 }} className={styles.card}>
      <CardMedia component="img" alt="green iguana" image={character?.img} />
      <CardContent className={styles.cardContent}>
        <Typography gutterBottom variant="h5" component="div">
          {character?.name}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          className={styles.description}
        >
          <div>Gender: {character?.gender}</div>
          <div>Born at: {character?.birth_year}</div>
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" component={Link} to={`/${character?.id}`}>
          Learn More
        </Button>
      </CardActions>
    </Card>
  );
};
