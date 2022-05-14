import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@material-ui/icons/DeleteRounded';
import UnSelectedIcon from '@material-ui/icons/UndoRounded';
import MailIcon from '@material-ui/icons/MailOutline';
import TagFacesIcon from '@material-ui/icons/TagFaces';

import {
  getRandomInt,
  dateWithMonths,
  dateWithDays,
} from '../../../utils/getRandomInt';
import { green, blue, red } from '@mui/material/colors';
import {
  Datagrid,
  ListBase,
  TextField,
  ShowButton,
  EditButton,
  DeleteButton,
  RichTextField,
  FilterButton,
  FilterForm,
  CreateButton,
  Pagination,
  ChipField,
  DateField,
  TextInput,
  SortButton,
  FunctionField,
  useListContext,
  DatagridBody,
  ArrayField,
  NumberField,
  RecordContextProvider,
  useUnselectAll,
  DeleteWithConfirmButton,
  useDeleteMany,
  useGetOne,
  useRefresh,
  useNotify,
  useGetMany,
  useRecordContext,
  useTranslate,
} from 'react-admin';
import {
  TableCell,
  TableRow,
  Box,
  CircularProgress,
  Stack,
  Chip,
  Button,
  Divider,
  Avatar,
  Checkbox,
} from '@mui/material';
import Loading from '../../ui/loading/loading';
import TaskAsideCard from '../../common/cards/task.card.aside';
import { getAuthData } from '../../../store/authcontext';
import TaskProgressBar from '../../common/progressbar/task.progress';
import { getAppColorized, getAppLoading } from '../../../store/appcontext';

const Aside = ({ id }) => {
  //const { data, isLoading } = useGetOne('tasks', {id: "1"});
  const { data } = id
    ? useGetOne('tasks', id)
    : { data: { title: 'not found' } };

  return (
    // <div className="aside" style={{ width: id?'200px':'0px', opacity: id?1:0, marginLeft: '1.6em',  transition: '300ms ease-out' }} >
    //     <Typography variant="h6">Posts stats</Typography>
    //     <Typography variant="body2">
    //         Current post title: {data?.title}
    //     </Typography>
    // </div>
    <TaskAsideCard id={id} />
  );
};

const QuickFilter = ({ label }) => {
  const translate = useTranslate();
  return <Chip sx={{ marginBottom: 1 }} label={translate(label)} />;
};

const TaskPagination = () => (
  <Pagination rowsPerPageOptions={[10, 15, 20, 50]} />
);

const taskFilters = (userId) => [
  <TextInput label="Search" icon={<MailIcon />} source="q" alwaysOn />,
  <TextInput
    resettable
    source="title"
    label="По наименованию"
    defaultValue="Hello, World!"
  />,
  <QuickFilter
    source="publish_gte"
    label="За последний месяц"
    defaultValue={dateWithMonths(-1)}
  />,
  <QuickFilter
    source="publish_lte"
    label="Ранее 1 месяца"
    defaultValue={dateWithMonths(-1)}
  />,
  <QuickFilter
    source="progress"
    label="Завешенные"
    defaultValue={{
      executeAt_lte: new Date(),
      progress: 100,
    }}
  />,
  <QuickFilter
    source="progress_lte"
    label="Незавершенные"
    defaultValue={{
      executeAt_gte: new Date(),
      progress_lte: 100,
    }}
  />,
  <QuickFilter
    source="userId"
    label="Создано пользователем"
    defaultValue={userId}
  />,
];

const DeleteTasksButton = ({ tasksIds, setTasksIds }) => {
  const refresh = useRefresh();
  const notify = useNotify();
  const [deleteMany, { isLoading, total, error }] = useDeleteMany(
    'tasks',
    tasksIds
  );
  const handleClick = () => {
    if (confirm('Уверены, что хотите удалить задачи?')) {
      deleteMany();
    }
  };

  useEffect(() => {
    //console.info(isLoading, total, error,'test for delete many');
    if (total === undefined) {
      notify(`Задачи ${tasksIds} удалены успешно`);
      setTasksIds([]);
      refresh();
    }
  }, [total, error, isLoading]);

  return (
    <Button
      variant="text"
      className="RaButton-button"
      disabled={tasksIds.length === 0 || isLoading}
      sx={{
        '& > *': { color: '#3f51b5' },
        fontFamily:
          '-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif',
        fontSize: '0.8125rem',
        color: '#3f51b5',
      }}
      startIcon={!(tasksIds.length === 0 || isLoading) && <DeleteIcon />}
      onClick={handleClick}
    >
      Delete All
    </Button>
  );
};

const UnselectButton = ({ setTasksIds }) => {
  const handleClick = () => {
    setTasksIds([]);
  };

  return (
    <Button
      variant="text"
      color="primary"
      sx={{
        '& > *': { color: '#3f51b5' },
        fontFamily:
          '-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif',
        fontSize: '0.8125rem',
        color: '#3f51b5',
      }}
      startIcon={<UnSelectedIcon />}
      onClick={handleClick}
    >
      UnSelect All
    </Button>
  );
};

const TaskToolbar = ({ tasksIds, setTasksIds, userId }) => {
  const filters = taskFilters(userId);

  return (
    <Stack direction="row" justifyContent="space-between">
      <FilterForm filters={filters} />
      <div>
        <SortButton fields={['title', 'createdAt', 'progress']} />
        <FilterButton filters={filters} />
        <CreateButton />
        <DeleteTasksButton tasksIds={tasksIds} setTasksIds={setTasksIds} />
        {tasksIds.length > 0 && <UnselectButton setTasksIds={setTasksIds} />}
      </div>
    </Stack>
  );
};

const ExecutorsField = ({ ids }) => {
  if (!ids) return <h5>Исполнители не назначены</h5>;

  const { data, loading, loaded, error } = useGetMany('users', ids);
  const [users, setUsers] = React.useState()

  React.useEffect(() => {
    if (data && loaded) {
      setUsers(data);
    }
  }, [data, loaded]);

  if (loading || !loaded) return <CircularProgress color="inherit" />;

  if (error) {
    return <p>ERROR</p>;
  }
console.log(!!users, users, 'check users')
  return (
    <>
    { !!users && (<Stack
      direction="row"
      /*divider={<Divider orientation="vertical" flexItem />} */

      sx={{
        maxWidth: 'min-content',
        justifyContent: 'flex-start',
        alignContent: 'space-between',
        gap: 1,
        flexWrap: 'wrap',
      }}
    >
      {users.map((user, ind) => (
        <Chip
          key={ind}
          label={user.name ? user.name : '-XXX-'}
          avatar={
            <Avatar
              alt="Пользователь"
              src={
                user.url ? user.url : `https://i.pravatar.cc/150?u=${user.id}`
              }
              sx={{ width: 24, height: 24 }}
            />
          }
          style={{
            backgroundColor: blue[100],
            flexBasis: '33%',
            color: green[500],
            display: 'inline-flex',
            fontWeight: 'bold',
            fontSize: 14,
          }}
        />
      ))}
    </Stack>)}
    </>
  );
};

export const TaskList = (props) => {
  const [tasksIds, setTasksIds] = React.useState([]);
  const [hoverId, setHoverId] = React.useState();

  const taskRef = React.useRef();
  const taskList = taskRef.current;

  const { loadedOnce: isLoading } = useSelector(
    (state) => state.admin.resources.tasks.list
  );

  const { user: authUser } = useSelector(getAuthData());
  const isAppColorized = useSelector(getAppColorized());
  const isAppLoading = useSelector(getAppLoading());

  React.useEffect(() => {
    if (taskList) {
      const ths = taskList.querySelectorAll('thead>tr>th');
      for (const taskTh of ths)
        taskTh.style.backgroundColor = isAppColorized
          ? blue[100]
          : 'whitesmoke';
      const paging = taskList.nextSibling?.querySelector('div.MuiToolbar-root');
      if (paging)
        paging.style.backgroundColor = isAppColorized
          ? blue[200]
          : 'whitesmoke';
    }
    return () => {};
  }, [taskList, isAppColorized, isLoading]);

  const postRowStyle = (id) => (record, index) => {
    return {
      backgroundColor: record.userId === id ? green[200] : red[100],
    };
  };

  return (
    <>
      {authUser && (
        <ListBase
          {...props}
          sort={{ field: 'publish', order: 'ASC' }}
          aside={<TaskAsideCard id={hoverId} />}
          style={
            !isLoading && isAppLoading ? { height: '0px', display: 'none' } : {}
          }
        >
          {!(!isLoading && isAppLoading) && (
            <TaskToolbar
              tasksIds={tasksIds}
              setTasksIds={setTasksIds}
              userId={authUser.uid}
            />
          )}
          {!(!isLoading && isAppLoading) && (
            // <Datagrid
            //   onMouseMove={handleMouseEnter}
            //   onMouseLeave={() => {
            //     setTimeout(() => handleUpdateId(null), 0);
            //   }}
            //   isRowSelectable={(row) => true}
            //   ref={taskRef}
            //   rowStyle={isAppColorized ? postRowStyle(authUser.id) : () => {}}
            // >
            //   <TextField source="id" />
            //   <TextField source="title" />
            //   <TextField source="publishing_state" />
            //   <TextField source="updatedby" />
            //   <TextField source="createdby" />
            //   <RichTextField source="body" />
            //   <ShowButton label="" />
            //   <EditButton label="" />
            //   <DeleteButton label="" redirect={false} />
            // </Datagrid>
            <MyDatagrid
              isAppColorized={isAppColorized}
              authId={authUser.uid}
              tasksIds={tasksIds}
              setTasksIds={setTasksIds}
              taskRef={taskRef}
              hoverId={hoverId}
              setHoverId={setHoverId}
              postRowStyle={postRowStyle}
            />
          )}
          {!(!isLoading && isAppLoading) && <TaskPagination />}
        </ListBase>
      )}
      {!isLoading && isAppLoading && <Loading />}
    </>
  );
};

const MyDatagridBody = (props) => (
  <DatagridBody {...props} row={<MyDatagridRow />} />
);

const ProgressBarField = (id, progress) => (
  <Box sx={{ position: 'relative', display: 'inline-flex' }}>
    <TaskProgressBar id={id} value={progress} />
  </Box>
);

const MyDatagrid = ({
  isAppColorized,
  authId,
  taskRef,
  postRowStyle,
  setTasksIds,
  tasksIds,
  hoverId,
  setHoverId,
  ...props
}) => {
  //const [isTransition, setTransition]=React.useState(false);

  const handleUpdateId = (id) => {
    setHoverId(id);
  };

  const handleMouseEnter = ({ target }) => {
    if (
      target.closest('tr') &&
      !target.closest('td')?.classList.contains('column-undefined') &&
      target.closest('tr').querySelector('td.column-id')
    ) {
      if (
        hoverId !==
        target.closest('tr').querySelector('td.column-id').textContent
      ) {
        handleUpdateId(
          target.closest('tr').querySelector('td.column-id').textContent
        );
        //setTransition(true);
      }
    }
  };

  React.useEffect(() => {
    setTasksIds(tasksIds);
    localStorage.setItem('tasksIds', JSON.stringify(tasksIds));
    return () => {};
  }, [tasksIds]);
  React.useEffect(() => {
    setTasksIds(
      localStorage.getItem('tasksIds')
        ? JSON.parse(localStorage.getItem('tasksIds'))
        : []
    );
    return () => {};
  }, []);

  return (
    <Datagrid
      {...props}
      onMouseMove={handleMouseEnter}
      onMouseLeave={() => {
        setTimeout(() => handleUpdateId(null), 0);
      }}
      isRowSelectable={(row) => authId === row.userId}
      ref={taskRef}
      rowStyle={isAppColorized ? postRowStyle(authId) : () => {}}
      sx={{
        '& .RaDatagrid-row': { color: 'green', backgroundColor: 'red' },
        '& .RaDatagrid-selectable': { color: 'green', backgroundColor: 'red' },
      }}
    >
      <FunctionField
        {...props}
        label="Selectable"
        render={(record) => (
          <Checkbox
            disabled={record.userId !== authId}
            checked={tasksIds.findIndex((id) => id === record.id) > -1}
            onClick={(event) => {
              if (tasksIds.findIndex((id) => id === record.id) < 0) {
                tasksIds.push(record.id);
              } else {
                const index = tasksIds.findIndex((id) => id === record.id);
                delete tasksIds[index];
              }
              setTasksIds(tasksIds.filter((task) => task !== null));
            }}
          />
        )}
      />

      <TextField label="Название" source="title" />
      <TextField label="Описание" source="description" />
      <TextField label="Дата создания" source="createdAt" />
      <FunctionField
        label="Статус"
        render={(record) => <ExecutorsField ids={record.executors} />}
      />

      <TextField label="Дата исполнения" source="executeAt" />
      <FunctionField
        label="Статус"
        render={(record) =>
          ProgressBarField(record.progressType?record.progressType:1, record.progress)
        }
      />
      <FunctionField
        label="Статус"
        render={(record) => {
          if (record.status) {
            if (new Date(record.finishedAt) <= new Date(record.executeAt)) {
              return '👍 Завершено';
            } else {
              return '✌️ Завершено вне сроков';
            }
          } else {
            if (new Date(record.executeAt) < new Date()) {
              if (record.progress < 100) {
                return '😬 Просрочено';
              } else {
                return '😪 Завершено но открыто';
              }
            } else {
              return '💪 На исполнении';
            }
          }
        }}
      />
      <FunctionField
        label="Комментарии"
        render={(record) => {
          if (record.commentable) {
            return '✔️';
          } else {
            return '✖️';
          }
        }}
      />

      <ShowButton label="" />
      <FunctionField
        label=""
        render={(record) => {
          return (
            record.userId === authId && (
              <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <EditButton basePath="/tasks" label="" record={record} />
                <DeleteWithConfirmButton
                  record={record}
                  label=""
                  undoable={true}
                  confirmContent="Подтверждаете удаление задачи?"
                  redirect={false}
                />
              </Box>
            )
          );
        }}
      />
    </Datagrid>
  );
};
