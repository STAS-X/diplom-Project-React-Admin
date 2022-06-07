import React, { useRef, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { emphasize } from '@material-ui/core/styles/colorManipulator';
import { green, red } from '@material-ui/core/colors';
import { useSelector } from 'react-redux';
import {
  Grid,
  Button,
  Card,
  CardContent,
  Typography,
} from '@material-ui/core';
import { Stack } from '@mui/material';
import {
  SimpleShowLayout,
  TextField,
  DateField,
  RichTextField,
  ShowButton,
  EditButton,
  useRefresh,
  useNotify,
  useGetOne,
  useDelete,
} from 'react-admin';
import { getAuthData } from '../../../store/authcontext';
import { getAppColorized } from '../../../store/appcontext';
import DeleteIcon from '@material-ui/icons/DeleteRounded';

const useStyles = (isCurrentUser, isColorized, isTaskLoaded, isDragging) =>
  makeStyles({
    root: {
      width: '350px',
      height: '380px',
      position: 'relative',
      margin: 10,
      backgroundColor: isColorized
        ? emphasize(isCurrentUser ? green[100] : red[100], 0.05)
        : 'whitesmoke',
      ...(!isTaskLoaded
        ? {
            border: 'red 6px dashed',
          }:{}),
      ...(isDragging
        ? {
            border: 'blue 5px dashed',
            background: isColorized
              ? 'linear-gradient(90deg, #cbf2ff 0%, #98cbe4 55%, #0b9dc3 100%)'
              : '',
          }
        : {}),
      boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
      '&:hover': {
        boxShadow: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px',
      },
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

const DeleteCommentButton = ({ record: comment, cardRef }) => {
  const animation = '_zoomOut';
  const refresh = useRefresh();
  const notify = useNotify();
  const [deleteOne, { loading, loaded, error }] = useDelete(
    'comments',
    comment.id,
    comment,
    {
      mutationMode: 'undoable',
      onSuccess: () => {
        notify(`Комментарий ${comment.id} удаляется`, { undoable: true });
        refresh();
      },
      onError: (error) =>
        notify('Ошибка при удалении комментария!', { type: 'warning' }),
    }
  );
  const handleAnimationEnd = ({target}) => {
    //e.stopPropagation();
    target.classList.remove(
      'animate__animated',
      `animate_${animation}`,
      'animate__fast'
    );
    target.remove();
    //refresh();

    
  };
  const handleClick = () => {

    const cardAnimate = cardRef.current;
    cardAnimate.addEventListener('animationend', handleAnimationEnd, {once:true});
    cardAnimate.classList.add(
      'animate__animated',
      `animate_${animation}`,
      'animate__fast'
    );
    setTimeout(()=>deleteOne(),0);
  };

  return (
    <Button
      variant="text"
      className="RaButtn-button"
      style={{
        fontFamily:
          '-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif',
        fontSize: '0.8125rem',
        color: '#f44336',
      }}
      disabled={loading}
      label=""
      startIcon={<DeleteIcon />}
      onClick={handleClick}
    ></Button>
  );
};

const CommentToolbar = ({ authId, record: comment, cardRef }) => {
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
        width: 64,
        height: 'min-content',
        right: 5,
        top: 5,
        zIndex: 1,
      }}
    >
      <SimpleShowLayout record={comment}>
        {authId !== comment.userId && <ShowButton label="" />}
        {authId === comment.userId && <EditButton label="" />}
        {authId === comment.userId && <DeleteCommentButton cardRef={cardRef} />}
      </SimpleShowLayout>
    </Stack>
  );
};

const CommentCard = ({ record: comment, isDragging }) => {
  const animation = '_pulse';

  const { user: authUser } = useSelector(getAuthData());
  const colorized = useSelector(getAppColorized());

  const { loaded: taskLoaded, data: task } = useGetOne('tasks', comment.taskId);
  //const taskLoaded=true;
  //const task = {title:'123', description:'456'};

  const cardRef = useRef();

  useEffect(() => {
    if (cardRef.current) {
      const cardAnimate = cardRef.current;

      const handleAnimationEnd = (e) => {
        //e.stopPropagation();
        e.target.classList.remove(
          'animate__animated',
          `animate_${animation}`,
          'animate__fast'
        );
      };
      const handleMouseEnter = (e) => {
        const {target} = e;
        if (localStorage.getItem('dragCommentId')) {
        } else {
        target.classList.add(
          'animate__animated',
          `animate_${animation}`,
          'animate__fast'
        )};
      };

      cardAnimate.addEventListener('animationend', handleAnimationEnd, {once:true});
      cardAnimate.addEventListener('mouseenter', handleMouseEnter);
    }

    return () => {};
  }, [cardRef.current]);

  const classes = useStyles(authUser.uid === comment.userId, colorized,taskLoaded && task, isDragging)();

  
  return (
    <Card variant="outlined" ref={cardRef} className={classes.root}>
      <CardContent>
        <CommentToolbar
          record={comment}
          authId={authUser.uid}
          cardRef={cardRef}
        />
        {task && (
          <>
            <Typography
              gutterBottom
              color="primary"
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
              Задача {task.title}
            </Typography>
            <Typography
              gutterBottom
              color="secondary"
              variant="h6"
              component="h3"
              style={{
                textAlign: 'center',
                padding: 0,
                margin: 0,
                marginBottom: -10,
                marginLeft: 10,
              }}
            >
              {task.description}
            </Typography>
          </>
        )}
        {!task && taskLoaded && (
          <Typography
            gutterBottom
            color="error"
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
            Задача удалена!
          </Typography>
        )}
        <Grid container direction="row" alignItems="flex-start" spacing={1}>
          <Grid item>
            <SimpleShowLayout record={comment}>
              <TextField label="Описание" source="description" />
              <DateField
                label="Дата создания"
                source="createdAt"
                locales="ru-Ru"
                options={{ dateStyle: 'long' }}
                color="primary"
              />
              <RichTextField
                label="Тело комментария"
                source="body"
                color="primary"
              />
            </SimpleShowLayout>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
export default CommentCard;
