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
    <Card className={styles.card}>
      <CardMedia component="img" alt="green iguana" image={character?.img} />
      <CardContent className={styles.cardContent}>
        <Typography gutterBottom variant="h5" component="div">
          {character?.name}
        </Typography>
        <div className={styles.description}>
          <Typography color="text.secondary">
            Gender: {character?.gender}
          </Typography>
          <Typography color="text.secondary">
            Born at: {character?.birth_year}
          </Typography>
        </div>
      </CardContent>
      <CardActions>
        <Button size="small" component={Link} to={`/${character?.id}`}>
          Learn More
        </Button>
      </CardActions>
    </Card>
  );
};
