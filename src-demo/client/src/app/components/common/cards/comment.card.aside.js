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
  RichTextField,
  useGetOne,
  useGetList,
} from 'react-admin';
import TaskProgressBar from '../../common/progressbar/task.progress';
import { getAuthData } from '../../../store/authcontext';
import { getAppColorized } from '../../../store/appcontext';
import { dateFormatter } from '../../../utils/displayDate';
import { getRandomInt } from '../../../utils/getRandomInt';

const useStyles = (isCurrentUser, isColorized, loaded) =>
  makeStyles({
    root: {
      right: 0,
      width: loaded === true ? 340 : 0,
      height: 'min-content',
      transition: '300ms ease-out',
      zIndex: 1,
      //maxWidth: '200px',
      opacity: loaded === true ? 1 : 0,
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

const CommentAsideCard = ({ id }) => {
  if (!id) return null;
  const { data: comment, loaded: commentLoaded } = useGetOne('comments', id);

  if (!commentLoaded) return null;

  return <CommentCard comment={comment} />;
};

function CommentCardCreator({ comment }) {
  const { user: authUser } = useSelector(getAuthData());
  const colorized = useSelector(getAppColorized());

  const { data: user, loading: userLoading } = useGetOne(
    'users',
    comment.userId
  );
  const {
    data: task,
    loading: taskLoading,
    loaded: taskLoaded,
  } = useGetOne('tasks', comment.taskId);

  const classes = useStyles(
    user ? authUser.uid === user.id : false,
    colorized,
    !userLoading
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
          spacing={1}
        >
          {task && (
            <Grid item xs={6}>
              <SimpleShowLayout record={task}>
                <TextField label="Название задачи" source="title" />
                <TextField label="Описание задачи" source="description" />
              </SimpleShowLayout>
            </Grid>
          )}
          <Grid item xs={6}>
            <SimpleShowLayout record={comment}>
              <TextField label="Название" source="title" />
              <TextField
                label="Описание"
                sortable={false}
                source="description"
              />
              <DateField
                label="Дата создания"
                source="createdAt"
                locales="ru-Ru"
                options={{ dateStyle: 'long' }}
                color="primary"
              />
            </SimpleShowLayout>
          </Grid>
          <Grid item xs={12} style={{ marginTop: -20 }}>
            <SimpleShowLayout record={comment}>
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
}

const CommentCard = React.memo(CommentCardCreator);

export default CommentAsideCard;
