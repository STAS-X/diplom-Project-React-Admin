import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { green, blue, red } from '@material-ui/core/colors';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import waveImg from '../../../resources/icons/sun.png';

const useStyles = (item, bgcolor) =>
  makeStyles({
    root: {
      width: item ? '200px' : '0',
      height: item ? '300px' : '200px',
      maxWidth: '200px',
      opacity: item ? 1 : 0,
      marginLeft: '1.6em',
      backgroundColor:
        bgcolor > 5 ? green[100] : bgcolor > 2 ? blue[100] : red[100],
      transition: '300ms ease-out',
    },
    media: {
      justifyContent:'center',
      width:'80%',
      height:'100px',
      marginTop: '1rem',
      objectFit: 'unset',
      margin:'auto'
    },
  });

const TaskAsideCard = ({ id }) => {
  console.log(id);
  const rnd = (Math.random() * 10).toFixed();
  const classes = useStyles(id, rnd)();

  return (
    <Card className={classes.root}>
      <CardMedia
        className={classes.media}
        image={waveImg }
        component='img'
        title="Солнечная сторона"
      ></CardMedia>
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2">
          CardMedia Example
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          The CardMedia component sets a background image to cover available
          space.
        </Typography>
      </CardContent>
    </Card>
  );
};
export default TaskAsideCard;
