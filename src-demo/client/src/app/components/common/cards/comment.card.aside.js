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

const CommentAsideCard = ({ id }) => {
  const [loaded, setLoaded] = React.useState(false);
  let task;
  let loadedTask=false;

  const { data: comment, loaded: loadedComment } = useGetOne('comments', id);
  if (loadedComment) {
   const { data, loaded } = useGetOne('tasks', comment.taskId);
    task=data; loadedTask=loaded;
  }

  console.info(loaded,' loaded comment');

  React.useEffect(()=>{
   setLoaded(loadedComment && loadedTask && id);
  },[loadedTask, loadedComment, id]);

  const rnd = (Math.random() * 10).toFixed();

    const useStyles = (item, bgcolor) =>
    makeStyles({
      root: {
        right: 0,
        width:loaded ?250:0,
        height: 300,
        zIndex: 1,
        //maxWidth: '200px',
        transition: '200ms ease-out',
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
              {`Комментарий к задаче ${task.title}`}
            </Typography>
            <Typography variant="body1" color="textSecondary" component="h3">
              {comment.description} <br />
              {`Id: ${id}`}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="h4">
              {'Задача создана:'}
              {comment.createdAt
                ? dateFormatter(comment.createdAt)
                : dateFormatter(Date.now())}
            </Typography>
          </>
        )}
        {!(loaded) && <CircularProgress color="inherit" />}
      </CardContent>
    </Card>
  );
};
export default CommentAsideCard;
