import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { green, blue, red } from '@material-ui/core/colors';
import { emphasize } from '@material-ui/core/styles/colorManipulator';
import {
  Card,
  CardMedia,
  Divider,
  CardContent,
  Typography,
  CircularProgress,
} from '@material-ui/core';
import { Stack } from '@mui/material';
import { getAuthData } from '../../../store/authcontext';
import { getAppColorized } from '../../../store/appcontext';
import {
  EmailField,
  FunctionField,
  SimpleShowLayout,
  TextField,
  EditButton,
  ShowButton,
  DateField,
  useGetList,
} from 'react-admin';

const useStyles = (isCurrentUser, isColorized) =>
  makeStyles({
    root: {
      width: '350px',
      height: 'min-content',
      margin: 10,
      position:'relative',
      boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
      '&:hover': {
        boxShadow: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px',
      },
      backgroundColor: isColorized
        ? emphasize(isCurrentUser ? green[100] : red[100], 0.05)
        : 'whitesmoke',
      transition: '300ms ease-out',
    },
    age: {
      '& span.MuiTypography-root:after': {
        content: '" лет"',
      },
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

const UserToolbar = ({ authId, record: user }) => {
  return (
    <Stack
      alignItems="flex-start"
      direction="row"
      justifyContent="flex-end"
      sx={{
        position: 'absolute',
        '& .MuiCardContent-root': {
          display: 'inline-flex',
          margin: 0,
          padding: 0,
        },
        '& .MuiButton-root': {
          minWidth: '32px !important',
          margin: 0,
          padding: 0,
        },
        width: 32,
        height: 'min-content',
        right: 5,
        top: 5,
        zIndex: 10,
      }}
    >
      <SimpleShowLayout record={user}>
        {authId !== user.id && <ShowButton label="" />}
        {authId === user.id && <EditButton label="" />}
      </SimpleShowLayout>
    </Stack>
  );
};

const UserCardExpand = (props) => {
  const {record:user} = props;
  const animation = '_rubberBand';

  const [taskNum, setTaskNum] = useState(0);
  const [taskCompleted, setCompleted] = useState(0);
  const [taskFailed, setFailed] = useState(0);
  const [commentNum, setCommentNum] = useState(0);

  const { user: authUser } = useSelector(getAuthData());
  const colorized = useSelector(getAppColorized());

  const { data: tasks, loaded: tasksLoaded } = useGetList(
    'tasks',
    { page: 1, perPage: -1 },
    { field: 'id', order: 'ASC' }
  );

  const { data: comments, loaded: commentsLoaded } = useGetList(
    'comments',
    { page: 1, perPage: -1 },
    { field: 'id', order: 'ASC' }
  );
  //const classes = useCallback((num) => , [taskCompleted]);
  const classes = useStyles(authUser.uid === user.uid, colorized)();
  const cardRef = useRef();

  useEffect(() => {
    if (Object.keys(tasks).length > 0) {
      const taskFilter = Object.keys(tasks)
        .map((key) => tasks[key])
        .filter((task) => task?.userId === authUser.id);
      setTaskNum(taskFilter.length);
      const taskCompleted = Object.keys(tasks)
        .map((key) => tasks[key])
        .filter((task) => task?.userId === authUser.id && task?.status);
      setCompleted(taskCompleted.length);
      const taskFailed = Object.keys(tasks)
        .map((key) => tasks[key])
        .filter(
          (task) =>
            task?.userId === authUser.id &&
            !task?.status &&
            new Date(task?.executeAt) > Date.now()
        );
      setFailed(taskFailed.length);
    }
    if (Object.keys(comments).length > 0) {
      const commentFilter = Object.keys(comments)
        .map((key) => comments[key])
        .filter((comment) => comment?.userId === authUser.id);
      setCommentNum(commentFilter.length);
    }

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
  }, [tasks, comments, cardRef.current]);

  return (
    <Card variant="outlined" ref={cardRef} className={classes.root}>
      <CardContent>
        <UserToolbar record={user} authId={authUser.uid} />
        <CardMedia
          className={classes.media}
          image={user.url}
          component="img"
          title="Avatar"
        ></CardMedia>
        <Typography
          gutterBottom
          color="textPrimary"
          variant="h6"
          component="h2"
          style={{
            textAlign: 'center',
            padding: 0,
            margin: 0,
            marginBottom: -10,
            marginLeft: 10,
          }}
        >
          {user.name}
        </Typography>
        <Stack
          direction="column"
          display="inline-flex"
          sx={{
            justifyContent: 'center',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: 0.2,
            padding: 0,
            margin: 0,
            paddingTop: -5,
            marginLeft: -1,
            '& label': { fontSize: '110%', mb: -0.5 },
          }}
        >
          <SimpleShowLayout record={user}>
            <FunctionField
              label="Логин"
              render={(record) => {
                if (record.providerId === 'phone') {
                  return (
                    <TextField
                      record={record}
                      label="Логин"
                      color="primary"
                      source="phone"
                    />
                  );
                }
                return (
                  <EmailField
                    record={record}
                    label="Логин"
                    color="primary"
                    source="email"
                  />
                );
              }}
            />
            <TextField
              label="Возраст"
              source="age"
              color="primary"
              className={classes.age}
            />
            <TextField
              label="Авторизация"
              source="providerId"
              color="primary"
            />
            <DateField
              label="Дата предыдущего входа"
              source="lastLogOut"
              locales="ru-Ru"
              showTime={true}
              options={{ dateStyle: 'long', timeStyle: 'medium' }}
              color="primary"
            />
          </SimpleShowLayout>
        </Stack>
        <Divider
          orientation="horizontal"
          style={{ marginTop: 10, marginBottom: 10 }}
        />
        <Typography variant="body2" color="primary" component="div">
          Всего создано заданий :{' '}
          {tasksLoaded ? taskNum : <CircularProgress color="inherit" />}
        </Typography>
        <Typography variant="body2" color="secondary" component="div">
          Из них завершено :{' '}
          {tasksLoaded ? taskCompleted : <CircularProgress color="inherit" />}
        </Typography>
        <Typography variant="body2" color="error" component="div">
          Из них просрочено :{' '}
          {tasksLoaded ? taskFailed : <CircularProgress color="inherit" />}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="div">
          Всего написано комментариев :{' '}
          {commentsLoaded ? commentNum : <CircularProgress color="inherit" />}
        </Typography>
        <Divider
          orientation="horizontal"
          style={{ marginTop: 10, marginBottom: -10 }}
        />
      </CardContent>
    </Card>
  );
};
export default UserCardExpand;
