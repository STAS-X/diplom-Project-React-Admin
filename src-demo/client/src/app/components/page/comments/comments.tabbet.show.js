import * as React from 'react';
import {
  Show,
  TabbedShowLayout,
  Tab,
  TextField,
  RichTextField,
  DateField,
  EmailField,
  NumberField,
  BooleanField,
  ShowButton,
  EditButton,
  FunctionField,
  ReferenceManyField,
  List,
  useListContext,
  useList,
  Pagination,
  Datagrid,
  ListContextProvider,
  BulkDeleteButton,
  useUpdateMany,
  useRefresh,
  useGetOne,
  useGetMany,
  useNotify,
  useUnselectAll,
  useMutation,
  Button,
} from 'react-admin';
import { green, blue, red } from '@mui/material/colors';
import { getAppColorized } from '../../../store/appcontext';
import {
  CircularProgress,
  Chip,
  TopToolbar
  
} from '@mui/material';
import CommentCard from '../../common/cards/comment.card.list';
import {useSelector} from 'react-redux';
import { getAuthData } from '../../../store/authcontext';
import {Visibility,VisibilityOff, ViewList, People as UserIcon, Pages as TaskIcon, Comment as CommentIcon  } from '@material-ui/icons';
import { dateFormatter } from '../../../utils/displayDate';
//import BulkTaskButton  from './CustomBulkTaskButton';

const CreatorField = ({userId}) => {
  const { data: user, loaded} = useGetOne('users', userId);

  if (!loaded) return <CircularProgress color="inherit" />;

  if (loaded && !user) {
    return <h5>-XXX-</h5>;
  }
 
  return (
    <span>{user.name}</span>
  );
};

const CommentTaskField = ({taskId}) => {
  const { data: task, loaded} = useGetOne('tasks', taskId);

  if (!loaded) return <CircularProgress color="inherit" />;

  if (loaded && !task) {
    return <h5>Задача не определена</h5>;
  }
 
  return (
    <span>{task.title + ' - ' + task.description}</span>
  );
};


export const CommentTabbetShow = (props) => {
  const { data: comment, loaded} = useGetOne('comments', props.id);
  //const { user: authUser } = useSelector(getAuthData());
  const { pathname } = props.history.location;
  if (pathname && pathname.slice(-4)==="show") {
    const newTab = localStorage.getItem('currentTab')
    if (newTab) localStorage.removeItem('currentTab');
    props.history.location.pathname = props.history.location.pathname+(newTab?newTab:'/comment');
  }

  //if (newPath.slice(-4)==="show")

return (
  <Show {...props} hasEdit={false}>
    <TabbedShowLayout syncWithLocation={true} variant="scrollable" spacing={2}>
      <Tab
        label="Общая информация"
        icon={<ViewList style={{ marginRight: 5 }} />}
        path="comment"
      >
        <TextField label="Описание" source="description" />
        <FunctionField
          label="Создатель"
          source="userId"
          render={(record) => <CreatorField userId={record.userId} />}
        />
        <FunctionField
          label="Комментируемая задача"
          source="taskId"
          render={(record) => <CommentTaskField taskId={record.taskId} />}
        />
        <DateField label="Дата создания" source="createdAt" lacales="ru" />
        <RichTextField label="Комментарий" source="body" />
      </Tab>
      <Tab
        label="Комментарий"
        icon={<CommentIcon style={{ marginRight: 5 }} />}
        path="card"
      >
        <CommentCard style={{ margin: 20 }} record={props.record} isDragging={false} />
      </Tab>
    </TabbedShowLayout>
  </Show>
);
};

