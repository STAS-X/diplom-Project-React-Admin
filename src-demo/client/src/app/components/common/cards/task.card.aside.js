import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { green, blue, red } from '@material-ui/core/colors';
import { emphasize } from '@material-ui/core/styles/colorManipulator';
import {
  Card,
  CardMedia,
  Grid,
  Box,
  Divider,
  CardContent,
  Typography,
  CircularProgress,
} from '@material-ui/core';
import { useSelector } from 'react-redux';
import {
  SimpleShowLayout,
  TextField,
  DateField,
  FunctionField,
  useGetOne,
  useGetList,
} from 'react-admin';
import TaskProgressBar from '../../common/progressbar/task.progress';
import { getAuthData } from '../../../store/authcontext';
import { getAppColorized } from '../../../store/appcontext';

const useStyles = (isCurrentUser, isColorized, loading) =>
  makeStyles({
    root: {
      right: 0,
      transition: '300ms ease-out',
      height: 'min-content',
      zIndex: 1,
      //maxWidth: '200px',
      ...(loading
        ? { transform: 'translateX(-100%)', opacity: 0 }
        : { opacity: 1 }),
      marginRight: '2em',
      marginTop: '3em',
      position: 'absolute',
      backgroundColor: isColorized
        ? emphasize(isCurrentUser ? green[100] : red[100], 0.05)
        : 'whitesmoke',
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

const TaskAsideCard = ({ id }) => {
  if (!id) return null;
  const { data: task, loaded: taskLoaded } = useGetOne('tasks', id);

  if (!taskLoaded) return null;

  return <TaskCard task={task} />;
};

function TaskCardCreator({ task }) {
  const { user: authUser } = useSelector(getAuthData());
  const colorized = useSelector(getAppColorized());

  const { data: user, loading: userLoading, loaded: userLoaded } = useGetOne('users', task.userId);
  const { total, loaded: commentsLoaded } = useGetList(
    'comments',
    { page: 1, perPage: -1 },
    { field: 'id', order: 'ASC' },
    { taskId: task.id }
  );

  const classes = useStyles(
    user ? authUser.uid === user.id : false,
    colorized,
    userLoading
  )();

  return (
    <Card variant="outlined" className={classes.root}>
      <CardMedia
        className={classes.media}
        image={user ? user.url : authUser.url}
        component="img"
        title="Avatar"
      ></CardMedia>
      <CardContent>
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
          {user ? user.name : ''}
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
              <TextField label="Название" source="title" />
              <TextField
                label="Описание"
                sortable={false}
                source="description"
              />
              <DateField
                label="Дата исполнения"
                source="executeAt"
                locales="ru-Ru"
                options={{ dateStyle: 'long' }}
                color="primary"
              />
            </SimpleShowLayout>
          </Grid>
          <Grid item xs={6}>
            <SimpleShowLayout record={task}>
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
        <Divider
          orientation="horizontal"
          style={{ marginBottom: 10 }}
        />
        <Typography variant="body2" color="primary" component="div">
          Всего комментариев :{' '}
          {commentsLoaded ? total? total: 0 : <CircularProgress color="inherit" />}
        </Typography>
        <Divider
          orientation="horizontal"
          style={{ marginTop: 10}}
        />
      </CardContent>
    </Card>
  );
}

const TaskCard = React.memo(TaskCardCreator);

export default TaskAsideCard;
