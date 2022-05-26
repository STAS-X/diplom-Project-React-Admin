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
import TaskAsideCard from '../../common/cards/task.card.aside';
import {useSelector} from 'react-redux';
import { getAuthData } from '../../../store/authcontext';
import {Visibility,VisibilityOff, ViewList, People as UserIcon, Pages as TaskIcon, Comment as CommentIcon  } from '@material-ui/icons';
import { dateFormatter } from '../../../utils/displayDate';
//import BulkTaskButton  from './CustomBulkTaskButton';

const CommentBulkActionButtons = (props) => {
  return (
    <>
        {/* default bulk delete action */}
        <BulkDeleteButton />
    </>
  )
};

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


const ExecutorsListField = ({ executors: ids }) => {
  if (!ids) return <h5>Исполнители не назначены</h5>;

  const { data: users, loading, loaded, error } = useGetMany('users', ids);

  if (loading || !loaded) return <CircularProgress color="inherit" />;

  if (error) {
    return <p>ERROR</p>;
  }
 
  return (
    <>
       {users.map((user, ind) => (
            <Chip
              key={ind}
              label={user.name?user.name:'-XXX-'}
            />
          ))}
    </>
  );
};

const KeywordsListField = ({ keywords }) => {
  if (!keywords) return <h5>Тэги не заданы</h5>;
  return (
    <>
       {keywords.map((key, ind) => (
            <Chip
              key={ind}
              label={key}
            />
          ))}
    </>
  );
};



const MyCommentDataGrid = ({taskId, ...props}) => {
  const commentRef = React.useRef();
  const commentList = commentRef.current;

  const isAppColorized = useSelector(getAppColorized());

  const { data, loaded, loading, total } = useListContext();

  const commentRowStyle = (id) => (record, index) => {
    return {
      backgroundColor: record.taskId === id ? green[200] : red[100],
    };
  };

  React.useEffect(() => {
    if (commentList) {
      const ths = commentList.querySelectorAll('thead>tr>th');
      for (const commentTh of ths)
        commentTh.style.backgroundColor = isAppColorized
          ? blue[100]
          : 'whitesmoke';
      const paging = commentList.nextSibling?.querySelector('div.MuiToolbar-root');
      if (paging) {
        paging.style.backgroundColor = isAppColorized
          ? blue[200]
          : 'whitesmoke';
        paging.querySelector('p').textContent = 'Строк на странице';
        if (paging.querySelector('.previous-page'))
          paging.querySelector('.previous-page').textContent = '< Предыдущая';
        if (paging.querySelector('.next-page'))
          paging.querySelector('.next-page').textContent = 'Следующая > ';
      }
    }
    return () => {};
  }, [commentRef.current, loading, loaded, isAppColorized]);

  if (!loaded || loading) return <CircularProgress color="inherit" />

  return (

          <Datagrid isRowSelectable={ record => true} rowStyle={isAppColorized ? commentRowStyle(taskId) : () => {}} ref={commentRef} >
            <TextField label="Описание" sortable={false} source="description" />
            <DateField
              locales="ru-Ru"
              showTime={true}
              options={{ dateStyle: 'long', timeStyle: 'medium' }}
              label="Дата создания"
              source="createdAt"
            />
            <TextField label="Комментарий" source="body" />
            <ShowButton />
            <EditButton />
          </Datagrid>

  )

}

export const TaskTabbetShow = (props) => {
  const { data: task, loaded} = useGetOne('tasks', props.id);
  //const { user: authUser } = useSelector(getAuthData());
  const { pathname } = props.history.location;
  console.log(props.history.location,'pathname');
  if (pathname && pathname.slice(-4)==="show") {
    const newTab = localStorage.getItem('currentTab')
    if (newTab) localStorage.removeItem('currentTab');
    props.history.location.pathname = props.history.location.pathname+(newTab?newTab:'/task');
  }

  //if (newPath.slice(-4)==="show")

return (
  <Show {...props} hasEdit={false}>
    <TabbedShowLayout syncWithLocation={true} variant="scrollable" spacing={2}>
      <Tab
        label="Общая информация"
        icon={<ViewList style={{ marginRight: 5 }} />}
        path="task"
      >
        <TextField label="Наименование" source="name" />
        <TextField label="Описание" source="description" />
        <FunctionField
          label="Создатель"
          source="userId"
          render={(record) => <CreatorField userId={record.userId}/>}
        />
        <DateField label="Дата создания" source="createdAt" lacales="ru" />
        <DateField label="Дата исполнения" source="executeAt" locales="ru" />
        <FunctionField
          label="Ход исполнения"
          source="progress"
          render={(record) =>
            <span>{record.progress}%</span>
          }
        />
        <FunctionField
          label="Исполнители"
          source="executors"
          render={(record) => <ExecutorsListField executors={record.executors} />}
        />

        <FunctionField
          label="Тэги"
          source="keywords"
          render={(record) => <KeywordsListField keywords={record.keywords} />}
        />
        <FunctionField
          label="Завершена"
          source="status"
          render={(record) => <span>{record.status?'Да':'Нет'}</span>}
        />
        <FunctionField
          label="Комментируема"
          source="commentable"
          render={(record) => <span>{record.commentable?'Да':'Нет'}</span>}
        />
      </Tab>
      <Tab
        label="Задача"
        icon={<TaskIcon style={{ marginRight: 5 }} />}
        path="card"
      >
        <TaskAsideCard style={{ margin: 20 }} id={props.id} />
      </Tab>
      <Tab
        label="Комментарии"
        icon={<CommentIcon style={{ marginRight: 5 }} />}
        path="comments"
      >
        <ReferenceManyField
          sort={{ field: 'createdAt', order: 'ASC' }}
          perPage={5}
          filter={{ taskId: props.id }}
          reference="comments"
          target="taskId"
          label={`Комментарии задачи ${
            task ? task.title : props.id
          }`}
        >
          <List
            {...props}
            actions={<></>}
            perPage={5}
            pagination={<Pagination rowsPerPageOptions={[5, 10, 20]} />}
            bulkActionButtons={<CommentBulkActionButtons />}
          >
            <MyCommentDataGrid taskId={props.id} />
          </List>
        </ReferenceManyField>
      </Tab>
    </TabbedShowLayout>
  </Show>
);
};

