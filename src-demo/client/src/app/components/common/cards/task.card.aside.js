import React from 'react';
import { useGetOne } from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';
import { green, blue, red } from '@material-ui/core/colors';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CircularProgress,
} from '@material-ui/core';
import { dateFormatter } from '../../../utils/displayDate';
import {getRandomInt} from '../../../utils/getRandomInt';
import waveImg from '../../../resources/icons/sun.png';

const TaskAsideCard = ({ id }) => {
  const [loaded, setLoaded] = React.useState(false);

  const { data: task, loaded: isLoaded } = useGetOne('tasks', id);

  React.useEffect(()=>{
   setLoaded(isLoaded && id);
  },[isLoaded, id]);

  const rnd = (Math.random() * 10).toFixed();

  const useStyles = (item, bgcolor) =>
    makeStyles({
      root: {
        right: 0,
        transition: '300ms ease-out',
        width: loaded ?250:0,
        height: '350px',
        zIndex: 1,
        //maxWidth: '200px',
        opacity: loaded ?1:0,
        marginRight: '2em',
        marginTop: '3em',
        position: 'absolute',
        backgroundColor:
          bgcolor > 5 ? green[100] : bgcolor > 2 ? blue[100] : red[100],
      },
      media: {
        justifyContent: 'center',
        width: '80%',
        height: '100px',
        marginTop: '1rem',
        objectFit: 'unset',
        margin: 'auto',
      },
    });

  const classes = useStyles(id, rnd)();

  return (
    <Card className={classes.root}>
      <CardMedia
        className={classes.media}
        image={waveImg}
        component="img"
        title="Солнечная сторона"
      ></CardMedia>
      <CardContent>
        {loaded && (
          <>
            <Typography gutterBottom variant="h5" component="h2">
              {task.title}
            </Typography>
            <Typography variant="body1" color="textSecondary" component="h3">
              {task.description} <br />
              {`Id: ${task.id}`}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="h4">
              {'Задача создана:'}
              {task.createdAt
                ? dateFormatter(task.createdAt)
                : dateFormatter(Date.now())}
            </Typography>
          </>
        )}
        {!loaded && <CircularProgress color="inherit" />}
      </CardContent>
    </Card>
  );
};
export default TaskAsideCard;
