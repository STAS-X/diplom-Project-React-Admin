import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { green, blue, red } from '@material-ui/core/colors';
import { emphasize } from '@material-ui/core/styles/colorManipulator';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { getAuthData } from '../../../store/authcontext';

const useStyles = (items) =>
  makeStyles({
    root: {
      width: '350px',
      height: 'min-content',
      boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
      '&:hover': {
        boxShadow: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px',
      },
      backgroundColor:
        emphasize(items > 5 ? green[100] : items > 2 ? blue[100] : red[100],0.05),
      transition: '300ms ease-out',
    },
    media: {
      justifyContent: 'center',
      width: '180px',
      height: '160px',
      marginTop: '1rem',
      objectFit: 'unset',
      margin: 'auto',
    },
  });

const UserCardExpand = () => {
  const animation = '_rubberBand';

  const [taskNum, setTaskNum] = useState(0);
  const [taskCompleted, setCompleted] = useState(0);
  const [commentNum, setCommentNum] = useState(0);

  const { user: authUser } = useSelector(getAuthData());
  const tasks = useSelector((state) => state.admin.resources.tasks.data);
  const comments = useSelector((state) => state.admin.resources.comments.data);
  //const classes = useCallback((num) => , [taskCompleted]);
  const classes = useStyles(taskNum)();
  const cardRef = useRef();

  useEffect(() => {

    if (Object.keys(tasks).length > 0) {
      const taskFilter = Object.keys(tasks).map(key => tasks[key]).filter(
        (task) => task?.userId === authUser.uid
      );
      setTaskNum(taskFilter.length);
      const taskCompleted = Object.keys(tasks).map(key => tasks[key]).filter(
        (task) => task?.userId === authUser.uid && task?.progress === 100
      );
    }
    if (Object.keys(comments).length > 0) {
      const commentFilter = Object.keys(comments).map(key => comments[key]).filter(
        (comment) => comment?.userId === authUser.uid
      );
      setCommentNum(commentFilter.length);
    }

    if (cardRef.current) {
      const cardAnimate = cardRef.current;

     const handleAnimationEnd = (e)=> {
      e.stopPropagation();
      e.target.classList.remove(
        'animate__animated',
        `animate_${animation}`,
        'animate__fast'
      );

    }
     const handleMouseEnter = ({target}) => {
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
  }, [tasks, comments, cardRef.current]);



  return (
    <Card variant="outlined" ref={cardRef} className={classes.root}>
      <CardMedia
        className={classes.media}
        image={authUser.photoURL}
        component="img"
        title="Avatar"
      ></CardMedia>
      <CardContent>
        <Typography
          gutterBottom
          color="textPrimary"
          variant="h6"
          component="h2"
        >
          Информация пользователя {authUser.displayName}
        </Typography>
        <Typography variant="body2" color="primary" component="p">
          Всего создано заданий : {taskNum}
        </Typography>
        <Typography variant="body2" color="secondary" component="p">
          Из них завершено : {taskCompleted}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          Всего написано комментариев : {commentNum}
        </Typography>
      </CardContent>
    </Card>
  );
};
export default UserCardExpand;
