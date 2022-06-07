import React, {useEffect, useRef} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { green, blue, red } from '@material-ui/core/colors';
import { emphasize } from '@material-ui/core/styles/colorManipulator';
import {
  Card,
  CardMedia,
  Button,
  Grid,
  Box,
  Divider,
  CardContent,
  Typography,
} from '@material-ui/core';
import { Stack } from '@mui/material';
import { useSelector } from 'react-redux';
import {
  SimpleShowLayout,
  TextField,
  DateField,
  FunctionField,
  RichTextField,
  ShowButton,
  EditButton,
  useRefresh,
  useNotify,
  useGetOne,
  useDelete,
  useGetList,
} from 'react-admin';
import TaskProgressBar from '../progressbar/task.progress';
import { getAuthData } from '../../../store/authcontext';
import { getAppColorized } from '../../../store/appcontext';
import { dateFormatter } from '../../../utils/displayDate';
import { getRandomInt } from '../../../utils/getRandomInt';
import DeleteIcon from '@material-ui/icons/DeleteRounded';

const useStyles = (isCurrentUser, isColorized, isDragging) =>
  makeStyles({
    root: {
      width: '350px',
      height: '380px',
      position: 'relative',
      margin: 10,
      backgroundColor: isColorized
        ? emphasize(isCurrentUser ? green[100] : red[100], 0.05)
        : 'whitesmoke',
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

  const DeleteTaskButton = ({ record: task, cardRef }) => {
    const animation = '_zoomOut';
    const refresh = useRefresh();
    const notify = useNotify();
    const [deleteOne, { loading, loaded, error }] = useDelete(
      'tasks',
      task.id,
      task,
      {
        mutationMode: 'undoable',
        onSuccess: () => {
          notify(`Задача ${task.id} удаляется`, { undoable: true });
          refresh();
        },
        onError: (error) =>
          notify('Ошибка при удалении комментария!', { type: 'warning' }),
      }
    );
    const handleAnimationEnd = ({ target }) => {
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
      cardAnimate.addEventListener('animationend', handleAnimationEnd, {
        once: true,
      });
      cardAnimate.classList.add(
        'animate__animated',
        `animate_${animation}`,
        'animate__fast'
      );
      setTimeout(() => deleteOne(), 0);
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

  const TaskToolbar = ({ authId, record: task, cardRef }) => {
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
        <SimpleShowLayout record={task}>
          {authId !== task.userId && <ShowButton label="" />}
          {authId === task.userId && <EditButton label="" />}
          {authId === task.userId && (
            <DeleteTaskButton cardRef={cardRef} />
          )}
        </SimpleShowLayout>
      </Stack>
    );
  };


const TaskCard = ({ record: task, isDragging }) => {

  const animation = '_pulse';

  const { user: authUser } = useSelector(getAuthData());
  const colorized = useSelector(getAppColorized());
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
        if (localStorage.getItem('dragTaskId')) {
        } else {
        target.classList.add(
          'animate__animated',
          `animate_${animation}`,
          'animate__fast'
        )};
      };

      cardAnimate.addEventListener('animationend', handleAnimationEnd);
      cardAnimate.addEventListener('mouseenter', handleMouseEnter);
    }

    return () => {};
  }, [cardRef.current]);


  const classes = useStyles(
    authUser.uid === task.userId,
    colorized,
    isDragging
  )();

  return (
    <Card variant="outlined" ref={cardRef} className={classes.root}>
      <CardContent>
        <TaskToolbar
          record={task}
          authId={authUser.uid}
          cardRef={cardRef}
        />
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
          {task.title}
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
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          columns={12}
          spacing={2}
        >
          <Grid item xs={6}>
            <SimpleShowLayout record={task}>
              <DateField
                label="Дата исполнения"
                source="executeAt"
                locales="ru-Ru"
                options={{ dateStyle: 'long' }}
                color="primary"
              />
              <FunctionField
                label="Ход исполнения"
                source="progress"
                render={(record) => (
                  <TaskProgressBar
                    id={record.progressType ? record.progressType : 1}
                    value={record.progress ? record.progress : 0}
                  />
                )}
              />
            </SimpleShowLayout>
          </Grid>
          <Grid item xs={6}>
            <SimpleShowLayout record={task}>
              <FunctionField
                label="Статус"
                source="status"
                render={(record) => {
                  if (record.status) {
                    if (
                      new Date(record.finishedAt) <= new Date(record.executeAt)
                    ) {
                      return (
                        <>
                          <strong style={{ fontSize: 16, color: 'green' }}>
                            👍
                          </strong>{' '}
                          Завершено
                        </>
                      );
                    } else {
                      return (
                        <>
                          <strong style={{ fontSize: 16, color: 'green' }}>
                            ✌️
                          </strong>{' '}
                          Завершено вне сроков
                        </>
                      );
                    }
                  } else {
                    if (new Date(record.executeAt) < new Date()) {
                      if (record.progress < 100) {
                        return (
                          <>
                            <strong style={{ fontSize: 16, color: 'red' }}>
                              ✌️
                            </strong>{' '}
                            Просрочено
                          </>
                        );
                      } else {
                        return (
                          <>
                            <strong style={{ fontSize: 16, color: 'red' }}>
                              ✌️
                            </strong>{' '}
                            Открыто повторно
                          </>
                        );
                      }
                    } else {
                      return (
                        <>
                          <strong style={{ fontSize: 16, color: 'blue' }}>
                            ✌️
                          </strong>{' '}
                          На исполнении
                        </>
                      );
                    }
                  }
                }}
              />
              <FunctionField
                label="Комментарии"
                source="commantable"
                render={(record) => {
                  if (record.commentable) {
                    return (
                      <strong style={{ fontSize: 16, color: 'green' }}>
                        ✔️
                      </strong>
                    );
                  } else {
                    return (
                      <strong style={{ fontSize: 16, color: 'red' }}>✖️</strong>
                    );
                  }
                }}
              />
            </SimpleShowLayout>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default TaskCard;
