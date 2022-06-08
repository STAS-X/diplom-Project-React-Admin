// in src/User.js
import * as React from 'react';
// tslint:disable-next-line:no-var-requires
import { useSelector } from 'react-redux';
import Loading from '../../ui/loading/loading';
import { green, blue, red } from '@mui/material/colors';
import {
  Datagrid,
  ListBase,
  TextField,
  ShowButton,
  EditButton,
  EmailField,
  FilterButton,
  FilterForm,
  DateField,
  TextInput,
  SortButton,
  FunctionField,
  useListContext,
  useTranslate,
  Pagination as RaPagination,
  PaginationActions as RaPaginationActions,
} from 'react-admin';
import { Stack, Chip } from '@mui/material';
import UserCardExpand from '../../common/cards/user.card.expand';
import UserDraggableComponent from '../../common/drag_drop/user.card.draggable';
import { getAuthData } from '../../../store/authcontext';
import {
  getAppColorized,
  getAppCarding,
  getAppLoading,
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

const UserPagination = ({ isAppColorized, ...props }) => {
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
      ActionsComponent={PaginationActions}
    />
  );
};

function dateWithMonths(months) {
  const date = new Date();
  date.setMonth(date.getMonth() + months);

  return date.toISOString().slice(0, 10);
}

const userFilters = (userId) => [
  <TextInput label="Глобальный поиск" source="q" alwaysOn />,
  <TextInput
    label="Почта"
    resettable
    source="email"
    defaultValue="test@test.com"
  />,
  <QuickFilter
    source="loggedOut_gte"
    label="Вход не далее месяца"
    defaultValue={dateWithMonths(-1)}
  />,
  <QuickFilter
    source="id"
    label="Текущий пользователь"
    defaultValue={userId}
  />,
];

const UserToolbar = ({ userId }) => {
  const { hideFilter, displayedFilters } = useListContext();
  const filters = userFilters(userId);

  const handleHideAllFilters = (e) => {
    Object.keys(displayedFilters).forEach((filter) => hideFilter(filter));
  };

  return (
    <Stack direction="row" justifyContent="space-between">
      <FilterForm filters={filters} />
      <div>
        <SortButton fields={['name', 'age', 'loggedOut']} />
        <FilterButton filters={filters} onClick={handleHideAllFilters} />
        {/*<CreateButton />*/}
      </div>
    </Stack>
  );
};

export const UserList = (props) => {
  const { loadedOnce: isLoading, ids } = useSelector(
    (state) => state.admin.resources.users.list
  );
  const users = useSelector((state) => state.admin.resources.users.data);

  const { user: authUser } = useSelector(getAuthData());
  const isAppColorized = useSelector(getAppColorized());
  const isAppLoading = useSelector(getAppLoading());
  const isCarding = useSelector(getAppCarding());

  return (
    <>
      {authUser && (
        <ListBase
          {...props}
          sort={{ field: 'name', order: 'ASC' }}
          style={
            !isLoading && isAppLoading ? { height: '0px', display: 'none' } : {}
          }
        >
          {!(!isLoading && isAppLoading) && (
            <UserToolbar userId={authUser.uid} />
          )}
          {!isCarding && !(!isLoading && isAppLoading) && (
            <MyDatagrid
              isAppColorized={isAppColorized}
              isCarding={isCarding}
              authId={authUser.uid}
            />
          )}
          {isCarding && !(!isLoading && isAppLoading) && (
            <UserDraggableComponent
              list={ids.map((id) => users[id])}
              ids={ids}
            />
          )}
          {!(!isLoading && isAppLoading) && (
            <UserPagination isAppColorized={isAppColorized} />
          )}
        </ListBase>
      )}
      {!isLoading && isAppLoading && <Loading />}
    </>
  );
};

const MyDatagrid = ({ isAppColorized, isCarding, authId, ...props }) => {
  const userRef = React.useRef();

  const userRowStyle = (id) => (record, index) => {
    return {
      backgroundColor: record.id === id ? green[200] : red[100],
    };
  };

  return (
    <Datagrid
      ref={userRef}
      isRowExpandable={(row) => row.id === authId}
      rowStyle={isAppColorized ? userRowStyle(authId) : () => {}}
      expand={<UserCardExpand />}
    >
      <TextField
        label=""
        sortable={false}
        source="id"
        style={{ display: 'none' }}
      />
      <TextField label="Имя" source="name" />
      <TextField label="Возраст" source="age" defaultValue={'не указан'} />
      <EmailField label="Почта" sortable={false} source="email" />
      <TextField label="Провайдер входа" sortable={false} source="providerId" />
      <DateField
        label="Дата последнего входа"
        source="lastLogOut"
        lacales="ru"
      />
      <ShowButton label="" />
      <FunctionField
        label=""
        render={(record) => {
          if (record.id === authId)
            return <EditButton basePath="/users" label="" record={record} />;
        }}
      />
    </Datagrid>
  );
};
