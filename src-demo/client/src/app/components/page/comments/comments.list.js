import React from 'react';
import { useSelector } from 'react-redux';
import { green, blue, red } from '@mui/material/colors';
import {
  Datagrid,
  ListBase,
  TextField,
  ShowButton,
  EditButton,
  RichTextField,
  FunctionField,
  FilterButton,
  FilterForm,
  DeleteWithConfirmButton,
  CreateButton,
  DateField,
  TextInput,
  SortButton,
  useGetOne,
  useRefresh,
  useNotify,
  useListContext,
  useDeleteMany,
  useTranslate,
  Pagination as RaPagination,
  PaginationActions as RaPaginationActions,
} from 'react-admin';
import {
  Stack,
  Chip,
  Box,
  Checkbox,
  Avatar,
  Typography,
  CircularProgress,
  Button,
} from '@mui/material';
import { dateWithMonths } from '../../../utils/getRandomInt';
import Loading from '../../ui/loading/loading';
import DeleteIcon from '@material-ui/icons/DeleteRounded';
import UnSelectedIcon from '@material-ui/icons/UndoRounded';
import CommentAsideCard from '../../common/cards/comment.card.aside';
import ComponentEmptyPage from '../../ui/empty/emptyPage';
import CommentDraggableComponent from '../../common/drag_drop/comment.card.draggable';
import { getAuthData } from '../../../store/authcontext';
import {
  getAppColorized,
  getAppLoading,
  getAppCarding,
} from '../../../store/appcontext';

const QuickFilter = ({ label }) => {
  const translate = useTranslate();
  return <Chip sx={{ marginBottom: 1 }} label={translate(label)} />;
};

const PaginationActions = (props) => {
  return (
    <RaPaginationActions
      {...props}
      // these props are passed down to the MUI <Pagination> component
      color="primary"
    />
  );
};

const CommentPagination = ({ isAppColorized, ...props }) => {
  React.useEffect(() => {
    const rowHead = document.querySelectorAll(
      'thead.MuiTableHead-root tr.MuiTableRow-root th'
    );
    if (rowHead) {
      const ths = Array.from(rowHead);
      ths.forEach(
        (th) =>
          (th.style.backgroundColor = isAppColorized ? blue[100] : 'whitesmoke')
      );
    }
    const paging = document.querySelector('div.MuiTablePagination-toolbar');
    if (paging) {
      paging.style.backgroundColor = isAppColorized ? blue[200] : 'whitesmoke';
      paging.querySelector('p').textContent = 'Строк на странице';
      if (paging.querySelector('.previous-page'))
        paging.querySelector('.previous-page').textContent = '< Предыдущая';
      if (paging.querySelector('.next-page'))
        paging.querySelector('.next-page').textContent = 'Следующая > ';
    }
    return () => {};
  }, [isAppColorized, props]);

  return (
    <RaPagination
      {...props}
      rowsPerPageOptions={[10, 15, 20]}
      ActionsComponent={RaPaginationActions}
    />
  );
};

const commentFilters = (userId) => [
  <TextInput label="Глобальный поиск" source="q" alwaysOn />,
  <TextInput
    label="Название"
    resettable
    source="title"
    helperText={'Введите название комментария'}
  />,
  <QuickFilter
    source="createdAt_gte"
    label="За последний месяц"
    defaultValue={dateWithMonths(-1)}
  />,
  <QuickFilter
    source="createdAt_lte"
    label="Ранее 1 месяца"
    defaultValue={dateWithMonths(-1)}
  />,
  <QuickFilter
    source="userId"
    label="Создано пользователем"
    defaultValue={userId}
  />,
];

const DeleteTasksButton = ({ commentsIds, setCommentsIds }) => {
  const refresh = useRefresh();
  const notify = useNotify();
  const [deleteMany, { loading, loaded, data, total, error }] = useDeleteMany(
    'comments',
    commentsIds,
    {
      mutationMode: 'undoable',
      onSuccess: () => {
        notify(`Комментарии ${commentsIds} удаляются`, { undoable: true });
        setCommentsIds([]);
        refresh();
      },
      onError: (error) =>
        notify('Ошибка при уалении комментаиев!', { type: 'warning' }),
    }
  );
  const handleClick = () => {
    if (confirm('Уверены, что хотите удалить задачи?')) {
      deleteMany();
    }
  };

  return (
    <Button
      variant="text"
      className="RaButton-button"
      disabled={commentsIds.length === 0 || loading}
      sx={{
        '& > *': { color: '#3f51b5' },
        fontFamily:
          '-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif',
        fontSize: '0.8125rem',
        color: '#3f51b5',
      }}
      startIcon={!(commentsIds.length === 0 || loading) && <DeleteIcon />}
      onClick={handleClick}
    >
      Delete All
    </Button>
  );
};

const UnselectButton = ({ setCommentsIds }) => {
  const handleClick = () => {
    setCommentsIds([]);
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

const CommentToolbar = ({ commentsIds, setCommentsIds, userId }) => {
  const filters = commentFilters(userId);
  const { hideFilter, displayedFilters } = useListContext();

  const handleHideAllFilters = (e) => {
    Object.keys(displayedFilters).forEach((filter) => hideFilter(filter));
  };

  return (
    <Stack direction="row" justifyContent="space-between">
      <FilterForm filters={filters} />
      <div>
        <SortButton fields={['title', 'createdAt']} />
        <FilterButton filters={filters} onClick={handleHideAllFilters} />
        <CreateButton />
        <DeleteTasksButton
          commentsIds={commentsIds}
          setCommentsIds={setCommentsIds}
        />
        {commentsIds.length > 0 && (
          <UnselectButton setCommentsIds={setCommentsIds} />
        )}
      </div>
    </Stack>
  );
};

const CommentAuthorField = ({ userId }) => {
  if (!userId) return <h5>Исполнитель не найден</h5>;

  const { data: user, loaded, error } = useGetOne('users', userId);

  if (!loaded) return <CircularProgress color="inherit" />;

  if (error) {
    return <p>ERROR</p>;
  }
  return (
    <>
      {user && (
        <Chip
          label={user.name ? user.name : '-XXX-'}
          avatar={
            <Avatar
              alt="Пользователь"
              src={
                user.url ? user.url : `https://i.pravatar.cc/300?u=${user.id}`
              }
              sx={{ width: 24, height: 24 }}
            />
          }
          style={{
            backgroundColor: blue[100],
            color: green[500],
            display: 'inline-flex',
            fontWeight: 'bold',
            fontSize: 14,
          }}
        />
      )}
    </>
  );
};

const CommentTaskField = ({ taskId }) => {
  if (!taskId) return <h5>Задача не найдена</h5>;

  const { data: task, loading, loaded, error } = useGetOne('tasks', taskId);

  if (!loaded && loading) return <CircularProgress color="inherit" />;

  if (error) {
    return <p style={{ color: 'red' }}>Задача удалена</p>;
  }
  return (
    task && (
      <>
        <Typography variant="body2" color="textPrimary" component="h3">
          {`Задача: ${task.title}`}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="h4">
          {`Id: ${task.id}`}
        </Typography>
      </>
    )
  );
};

export const CommentList = (props) => {
  const [commentsIds, setCommentsIds] = React.useState([]);
  const [hoverId, setHoverId] = React.useState();

  const { user: authUser } = useSelector(getAuthData());
  const isAppColorized = useSelector(getAppColorized());
  const isAppLoading = useSelector(getAppLoading());
  const isCarding = useSelector(getAppCarding());

  const {
    loadedOnce: isLoading,
    total,
    displayedFilters,
    ids,
  } = useSelector((state) => state.admin.resources.comments.list);
  const comments = useSelector((state) => state.admin.resources.comments.data);

  //const [isTransition, setTransition]=React.useState(false);
  const isZeroElements = total === 0 && displayedFilters;

  React.useEffect(() => {
    setCommentsIds(
      localStorage.getItem('commentsIds')
        ? JSON.parse(localStorage.getItem('commentsIds'))
        : []
    );

    return () => {};
  }, []);

  return (
    <>
      {authUser && (
        <ListBase
          {...props}
          sort={{ field: 'createdAt', order: 'ASC' }}
          //aside={<CommentAsideCard id={hoverId} />}
          style={
            !isLoading && isAppLoading ? { height: '0px', display: 'none' } : {}
          }
        >
          {!isZeroElements && !(!isLoading && isAppLoading) && (
            <CommentToolbar
              commentsIds={commentsIds}
              setCommentsIds={setCommentsIds}
              userId={authUser.uid}
            />
          )}
          {isZeroElements && !(!isLoading && isAppLoading) && (
            <ComponentEmptyPage
              path={'comments'}
              title={'Комментарии отсутствуют. Хотите создать новый?'}
            />
          )}
          {!isCarding && !isZeroElements && !(!isLoading && isAppLoading) && (
            <MyDatagrid
              isAppColorized={isAppColorized}
              authId={authUser.uid}
              commentsIds={commentsIds}
              setCommentsIds={setCommentsIds}
              hoverId={hoverId}
              setHoverId={setHoverId}
            />
          )}
          {isCarding && !isZeroElements && !(!isLoading && isAppLoading) && (
            <CommentDraggableComponent
              list={ids.map((id) => comments[id])}
              ids={ids}
            />
          )}
          {!isZeroElements && !(!isLoading && isAppLoading) && (
            <CommentPagination isAppColorized={isAppColorized} />
          )}
        </ListBase>
      )}
      {!isLoading && isAppLoading && <Loading />}
    </>
  );
};

const ControlButtons = ({ record, authId }) => {
  return (
    <FunctionField
      label=""
      render={(record) => {
        //const { data, isLoading } = useGetOne('tasks', {id: "1"});

        return (
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <ShowButton basePath="/comments" label="" record={record} />
            {record.userId === authId && (
              <>
                <EditButton basePath="/comments" label="" record={record} />
                <DeleteWithConfirmButton
                  record={record}
                  label=""
                  undoable={true}
                  confirmContent="Подтверждаете удаление задачи?"
                  redirect={false}
                />
              </>
            )}
          </Box>
        );
      }}
    />
  );
};

const MyDatagrid = ({
  isAppColorized,
  authId,
  setCommentsIds,
  commentsIds,
  hoverId,
  setHoverId,
  ...props
}) => {
  const commentRef = React.useRef();
  const commentList = commentRef.current;

  const { loaded, loading } = useListContext();

  const commentRowStyle = (id) => (record, index) => {
    return {
      backgroundColor: record.userId === id ? green[200] : red[100],
    };
  };

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
        const newHoverId = target
          .closest('tr')
          .querySelector('td.column-id').textContent;
        if (newHoverId) handleUpdateId(newHoverId);
        //setTransition(true);
      }
    }
  };

  return (
    <Stack>
      <Datagrid
        {...props}
        onMouseMove={handleMouseEnter}
        onMouseLeave={() => {
          setTimeout(() => handleUpdateId(null), 0);
        }}
        isRowSelectable={(row) => authId === row.userId}
        ref={commentRef}
        rowStyle={isAppColorized ? commentRowStyle(authId) : () => {}}
        sx={{
          '& .RaDatagrid-row': { color: 'green', backgroundColor: 'red' },
          '& .RaDatagrid-selectable': {
            color: 'green',
            backgroundColor: 'red',
          },
        }}
      >
        <FunctionField
          {...props}
          label="Выбрать"
          render={(record) => (
            <Checkbox
              disabled={record.userId !== authId}
              checked={commentsIds.findIndex((id) => id === record.id) > -1}
              onClick={(event) => {
                if (commentsIds.findIndex((id) => id === record.id) < 0) {
                  setCommentsIds((prevComments) => {
                    prevComments.push(record.id);
                    return prevComments;
                  });
                } else {
                  setCommentsIds((prevComments) =>
                    prevComments.filter((id) => id !== record.id)
                  );
                }
              }}
            />
          )}
        />
        <TextField
          label=""
          sortable={false}
          source="id"
          style={{ display: 'none' }}
        />
        <TextField source="title" label="Название" />
        <DateField label="Дата создания" source="createdAt" lacales="ru" />
        <FunctionField
          label="Автор комментария"
          sortable={false}
          source="userId"
          render={(record) => <CommentAuthorField userId={record.userId} />}
        />
        <FunctionField
          label="Задача"
          sortable={false}
          source="taskId"
          render={(record) => <CommentTaskField taskId={record.taskId} />}
        />
        <RichTextField
          label="Текст комментария"
          sortable={false}
          source="body"
        />

        <ControlButtons authId={authId} />
      </Datagrid>
      {hoverId && <CommentAsideCard id={hoverId} />}
    </Stack>
  );
};
