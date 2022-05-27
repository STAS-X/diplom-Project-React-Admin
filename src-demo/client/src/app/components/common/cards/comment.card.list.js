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

const useStyles = (isCurrentUser, isColorized) =>
  makeStyles({
    root: {
      width: '380px',
      height: '240px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
      '&:hover': {
        boxShadow: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px',
      },
      backgroundColor: isColorized?emphasize(
        isCurrentUser ? green[100] : red[100],
        0.05
      ):'whitesmoke',
      transition: '300ms ease-out',
    },
    media: {
      justifyContent: 'center',
      width: '200px',
      height: '150px',
      marginTop: '1rem',
      objectFit: 'unset',
      margin: 'auto',
    },
  });

const CommentAsideCard = ({ record: comment }) => {

  const animation = '_pulse';

  const { user: authUser } = useSelector(getAuthData());
  const colorized = useSelector(getAppColorized());

  const {loaded: taskLoaded, data: task} = useGetOne('tasks', comment.taskId);

  const cardRef = useRef();

  useEffect(() => {
 
    if (cardRef.current) {
      const cardAnimate = cardRef.current;

      const handleAnimationEnd = (e) => {
        e.stopPropagation();
        e.target.classList.remove(
          'animate__animated',
          `animate_${animation}`,
          'animate__fast'
        );
      };
      const handleMouseEnter = ({ target }) => {
        target.classList.add(
          'animate__animated',
          `animate_${animation}`,
          'animate__fast'
        );
      };

      cardAnimate.addEventListener('animationend', handleAnimationEnd);
      cardAnimate.addEventListener('mouseenter', handleMouseEnter);
    }

    return () => {};
  }, [cardRef.current]);

  const classes = useStyles(
    authUser.uid === comment.userId,
    colorized
  )();

  return (
 <Card variant="outlined" ref={cardRef} className={classes.root}>
      <CardContent>
          <Typography
            gutterBottom
            color="primary"
            variant="h6"
            component="h2"
            style={{textAlign:'center', padding:0, margin:0, marginBottom:-10, marginLeft:10}}
          >
            Задача {task.title}
          </Typography>
          <Typography
            gutterBottom
            color="secondary"
            variant="h6"
            component="h3"
            style={{textAlign:'center', padding:0, margin:0, marginBottom:-10, marginLeft:10}}
          >
            {task.description}
          </Typography>
          {taskLoaded && (
          <Grid
            container
            direction="column"
            alignItems="flex-start"
            spacing={1}
          >
            <Grid item >
              <SimpleShowLayout record={{ comment }}>
                <TextField
                  label="Описание"
                  source="description"
                />
                <DateField
                  label="Дата создания"
                  source="createdAt"
                  locales="ru-Ru"
                  options={{ dateStyle: 'long' }}
                  color="primary"
                />
                <RichTextField label="Тело комментария" source="body" color="primary" />
              </SimpleShowLayout>
            </Grid>
          </Grid>)}
        )}
      </CardContent>
    </Card>
  );
};
export default CommentAsideCard;
