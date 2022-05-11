import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import DeleteIcon from '@material-ui/icons/DeleteRounded';
import UnSelectedIcon from '@material-ui/icons/UndoRounded';
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
  DateField,
  TextInput,
  SortButton,
  FunctionField,
  useListContext,
  DatagridBody,
  RecordContextProvider,
  useUnselectAll,
  DeleteWithConfirmButton,
  useDeleteMany,
  useGetOne,
  useRefresh,
  useNotify,
  useRecordContext,
  useTranslate,
} from 'react-admin';
import {
  TableCell,
  TableRow,
  Stack,
  Chip,
  Button,
  Checkbox,
} from '@mui/material';
import Loading from '../../ui/loading/loading';
import TaskAsideCard from '../../common/cards/task.card.aside';
import { getAuthData } from '../../../store/authcontext';
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
  <Pagination rowsPerPageOptions={[10, 25, 50, 100]} />
);

function dateWithMonths(months) {
  const date = new Date();
  date.setMonth(date.getMonth() + months);

  return date.toISOString().slice(0, 10);
}

const taskFilters = [
  <TextInput label="Search" source="q" alwaysOn />,
  <TextInput
    label="Title"
    resettable
    source="title"
    defaultValue="Hello, World!"
  />,
  <QuickFilter
    source="publish_gte"
    label="Last month"
    defaultValue={dateWithMonths(-1)}
  />,
  <QuickFilter
    source="publish_lte"
    label="Least month"
    defaultValue={dateWithMonths(-1)}
  />,
  <QuickFilter
    source="id"
    label="By current user"
    defaultValue={'DTGCdToJ3SloFowi6ffX'}
  />,
];

const DeleteTasksButton = ({ tasksIds, setTasksIds }) => {
  const refresh = useRefresh();
  const notify = useNotify();
  const [deleteMany, { isLoading, total, error }] = useDeleteMany('tasks', {
    ids: tasksIds,
  });
  const handleClick = () => {
    if (confirm('Уверены, что хотите удалить задачи?')) {
      deleteMany();
    }
  };

  useEffect(() => {
    if (error) {
      console.log(total, error, 'всего удалено задач');
      notify(`Задачи ${tasksIds} удалены успешно`);
      setTasksIds([]);
      refresh();
    }
  }, [total, error]);

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

const TaskToolbar = ({ tasksIds, setTasksIds }) => (
  <Stack direction="row" justifyContent="space-between">
    <FilterForm filters={taskFilters} />
    <div>
      <SortButton fields={['title', 'publish', 'progress']} />
      <FilterButton filters={taskFilters} />
      <CreateButton />
      <DeleteTasksButton tasksIds={tasksIds} setTasksIds={setTasksIds} />
      {tasksIds.length > 0 && <UnselectButton setTasksIds={setTasksIds} />}
    </div>
  </Stack>
);

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
    console.log(taskList, 'get task list element');
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
            <TaskToolbar tasksIds={tasksIds} setTasksIds={setTasksIds} />
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
              authId={authUser.id}
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
  console.log(props, 'new record');
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
              console.log(tasksIds);
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

      <TextField source="id" />
      <TextField source="title" />
      <TextField source="publishing_state" />
      <TextField source="updatedby" />
      <TextField source="createdby" />
      <RichTextField source="body" />
      <ShowButton label="" />
      <FunctionField
        label=""
        render={(record) => {
          console.log(record, 'record data');
          return (
            record.userId === authId && (
              <>
                <EditButton label="" />
                <DeleteWithConfirmButton
                  record={record}
                  label=""
                  undoable={true}
                  confirmContent="Подтверждаете удаление задачи?"
                  redirect={false}
                />
              </>
            )
          );
        }}
      />
    </Datagrid>
  );
};
