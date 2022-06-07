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
  useNotify,
  useUnselectAll,
  useMutation,
  Button,
} from 'react-admin';
import { green, blue, red } from '@mui/material/colors';
import { getAppColorized } from '../../../store/appcontext';
import {
  CircularProgress,
  TopToolbar
  
} from '@mui/material';
import UserCardExpand from '../../common/cards/user.card.expand';
import ComponentEmptyPage from '../../ui/empty/emptyPage';
import {useSelector} from 'react-redux';
import { getAuthData } from '../../../store/authcontext';
import {Visibility,VisibilityOff, ViewList, People as UserIcon, Pages as TaskIcon, Comment as CommentIcon  } from '@material-ui/icons';
import { dateFormatter } from '../../../utils/displayDate';

const BulkUpdateButton = ({label, status}) => {
    const { selectedIds } = useListContext();
    const refresh = useRefresh();
    const notify = useNotify();
    const unselectAll = useUnselectAll('tasks');
    const [updateMany, {loading, loaded, error}] = useUpdateMany(
        'tasks',
        selectedIds,{ status },
        {
            mutationMode: 'undoable',
            onSuccess: () => {
              refresh();
              notify(status?'Задачи завершены успешно':'Задачи открыты для исполнения', { undoable: true });
              unselectAll();
            },
            onError: error => notify('Ошибка при обновлении задач!', { type: 'warning' }),
            
        }
    );

    React.useEffect(()=>{
      if (loaded) {
          refresh();
          //notify(status?'Задачи завершены успешно':'Задачи открыты для исполнения');
          unselectAll();
      }
      if (error) {
        notify(`Ошибка ${error} при обновлении задач!`, { type: 'warning' })
      }  

    }, [loaded, error])

    return (
        <Button
            label={label}
            disabled={loading}
            onClick={() => {updateMany()}}
        >
            {status? <Visibility/>:<VisibilityOff/>}
        </Button>
    );
};


const TaskBulkActionButtons = (props) => {
  return (
    <>
        <BulkUpdateButton label="Завершить" status={true}/>
        <BulkUpdateButton label="Открыть" status={false}/>
        {/*<BulkTaskButton label="Update"  />
         default bulk delete action */}
        <BulkDeleteButton />
    </>
  )
};

const MyTaskDataGrid = ({userId, ...props}) => {
  const taskRef = React.useRef();
  const taskList = taskRef.current;

  const isAppColorized = useSelector(getAppColorized());
  const { user: authUser } = useSelector(getAuthData());
  
  const { data, loaded, loading, total } = useListContext();

  const taskRowStyle = (id) => (record) => {
    return {
      backgroundColor: record.userId === id ? green[200] : red[100],
    };
  };

  React.useEffect(() => {
    if (taskList) {
      const ths = taskList.querySelectorAll('thead>tr>th');
      for (const taskTh of ths)
        taskTh.style.backgroundColor = isAppColorized
          ? blue[100]
          : 'whitesmoke';
      const paging = taskList.nextSibling?.querySelector('div.MuiToolbar-root');
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
  },[taskRef.current, loading, loaded, isAppColorized]);

  if (!loaded || loading) return <CircularProgress color="inherit" />


  return (
          <Datagrid isRowSelectable={ record => true} rowStyle={isAppColorized ? taskRowStyle(authUser.uid) : () => {}} ref={taskRef} >
            <TextField label="Заголовок" source="title" />
            <TextField label="Описание" sortable={false} source="description" />
            <DateField
              locales="ru-Ru"
              showTime={true}
              options={{ dateStyle: 'long', timeStyle: 'medium' }}
              label="Дата создания"
              source="createdAt"
            />
            <FunctionField 
              label="Статус"
              source="status" 
              sortable={false}
              render={(record) => {
                        if (record.status) {
                        return (
                          <strong style={{ fontSize: 16, color: 'green' }}>✔️</strong>
                        );
                      } else {
                        return <strong style={{ fontSize: 16, color: 'red' }}>✖️</strong>;
                      }
                    }}
            />
            <ShowButton />
            {authUser.uid === userId && <EditButton />}
          </Datagrid>
  )

}

const CommentBulkActionButtons = (props) => {
  return (
    <>
        {/* default bulk delete action */}
        <BulkDeleteButton />
    </>
  )
};

const MyCommentDataGrid = ({userId, ...props}) => {
  const commentRef = React.useRef();
  const commentList = commentRef.current;

  const isAppColorized = useSelector(getAppColorized());
  const { user: authUser } = useSelector(getAuthData());

  const { data, loaded, loading, total } = useListContext();

  const commentRowStyle = (id) => (record) => {
    return {
      backgroundColor: record.userId === id ? green[200] : red[100],
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

          <Datagrid isRowSelectable={ record => true} rowStyle={isAppColorized ? commentRowStyle(authUser.uid) : () => {}} ref={commentRef} >
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
            {authUser.uid === userId && <EditButton />}
          </Datagrid>

  )

}

export const UserTabbetShow = (props) => {
  const { data: user, loaded} = useGetOne('users', props.id);
  const { user: authUser } = useSelector(getAuthData());
  const { pathname } = props.history.location;
  if (pathname.slice(-4)==="show") {
    const newTab = localStorage.getItem('currentTab')
    if (newTab) localStorage.removeItem('currentTab');
    props.history.location.pathname = props.history.location.pathname+(newTab?newTab:'/user');
  }

  //if (newPath.slice(-4)==="show")

return (
  <Show {...props} hasEdit={false}>
    <TabbedShowLayout
      syncWithLocation={true}
      variant="scrollable"
      spacing={2}
    >
      <Tab label="Общая информация" icon={<ViewList style={{marginRight : 5}}/>} path="user">
        <TextField label="Имя пользователя" source="name" />
        <TextField label="Возраст" source="age" />
        <EmailField label="Почта" source="email" />
        <DateField label="Создан" source="createdAt" />
        <TextField label="Провайдер авторизации" source="providerId" />
        <DateField label="Дата предыдущего входа" source="lastLogOut" locales="ru-Ru"
                   showTime={true} options={{ dateStyle: 'long', timeStyle: 'medium' }}
                   defaultValue={dateFormatter(Date.now())}  />
      </Tab>
      <Tab label="Профиль" icon={<UserIcon style={{marginRight : 5}}/>} path="card">
        <UserCardExpand style={{ margin:20}} userId={props.id}/>
      </Tab>
      <Tab label="Задачи" icon={<TaskIcon style={{marginRight : 5}}/>} path="tasks">
        <ReferenceManyField
          sort={{ field: 'createdAt', order: 'ASC' }}
          target="userId"
          perPage={5}
          filter={{userId: props.id}}
          reference="tasks"
          label={`Задачи пользователя ${user?user.name:props.permissions.name}`}
        >
          <List {...props} 
            actions={<></>} 
            perPage={5} 
            empty={<ComponentEmptyPage path={'tasks'} title={'Задачи отсутствуют'} isAuth={authUser.uid===props.id} />}
            pagination={<Pagination rowsPerPageOptions={[5, 10, 20]}/>} 
            bulkActionButtons={<TaskBulkActionButtons />}
            >
            <MyTaskDataGrid userId={props.id}/>
          </List>  
        </ReferenceManyField>
      </Tab>
      <Tab label="Комментарии" icon={<CommentIcon style={{marginRight : 5}}/>} path="comments">
        <ReferenceManyField
          sort={{ field: 'createdAt', order: 'ASC' }}
          perPage={5}
          filter={{userId: props.id}}
          reference="comments"
          target="userId"
          label={`Комментарии пользователя ${user?user.name:props.permissions.name}`}
        >
          <List {...props} 
            actions={<></>} 
            perPage={5} 
            empty={<ComponentEmptyPage path={'comments'} title={'Комментарии отсутствуют'} isAuth={authUser.uid===props.id} />}
            pagination={<Pagination rowsPerPageOptions={[5, 10, 20]}/>} 
            bulkActionButtons={<CommentBulkActionButtons />}
            >
           <MyCommentDataGrid userId={props.id}/>
          </List>
        </ReferenceManyField>
      </Tab>
    </TabbedShowLayout>
  </Show>
);
};

