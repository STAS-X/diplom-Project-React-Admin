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
  DeleteButton,
  EmailField,
  FilterButton,
  FilterForm,
  CreateButton,
  Pagination,
  DateField,
  TextInput,
  SortButton,
  FunctionField,
  useGetOne,
  useListContext,
  useTranslate,
} from 'react-admin';
import { Stack, Chip } from '@mui/material';
import UserCardExpand from '../../common/cards/user.card.expand';
import { getAuthData } from '../../../store/authcontext';
import { getAppColorized, getAppLoading } from '../../../store/appcontext';

const QuickFilter = ({ label }) => {
  const translate = useTranslate();
  return <Chip sx={{ marginBottom: 1 }} label={translate(label)} />;
};

const UserPagination = () => (
  <Pagination rowsPerPageOptions={[10, 25, 50, 100]} />
);

function dateWithMonths(months) {
  const date = new Date();
  date.setMonth(date.getMonth() + months);

  return date.toISOString().slice(0, 10);
}

const userFilters = (userId) =>  ([
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
]);

const UserToolbar = ({userId}) => {
  const filters = userFilters(userId);
  return (
  <Stack direction="row" justifyContent="space-between">
    <FilterForm filters={filters} />
    <div>
      <SortButton fields={['name', 'email', 'loggedOut']} />
      <FilterButton filters={filters} />
      {/*<CreateButton />*/}
    </div>
  </Stack>
  )
};

export const UserList = (props) => {
  const userRef = React.useRef();
  const userList = userRef.current;

  const { loadedOnce: isLoading } = useSelector(
    (state) => state.admin.resources.users.list
  );

  const { user: authUser } = useSelector(getAuthData());
  const isAppColorized = useSelector(getAppColorized());
  const isAppLoading = useSelector(getAppLoading());

  const postRowStyle = (id) => (record, index) => {
    return {
      backgroundColor: record.id === id ? green[200] : red[100],
    };
  };

  React.useEffect(() => {
    if (userList) {
      const ths = userList.querySelectorAll('thead>tr>th');
      for (const userTh of ths)
        userTh.style.backgroundColor = isAppColorized
          ? blue[100]
          : 'whitesmoke';
      const paging = userList.nextSibling?.querySelector('div.MuiToolbar-root');
      if (paging)
        paging.style.backgroundColor = isAppColorized
          ? blue[200]
          : 'whitesmoke';
    }
    return () => {};
  }, [userList, isAppColorized, isLoading]);

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
          {!(!isLoading && isAppLoading) && <UserToolbar userId={authUser.uid} />}
          {!(!isLoading && isAppLoading) && (
            <Datagrid
              ref={userRef}
              isRowExpandable={(row) =>
                authUser ? row.id === authUser.id : false
              }
              rowStyle={isAppColorized ? postRowStyle(authUser.id) : () => {}}
              expand={<UserCardExpand />}
            >
              <TextField label="" sortable={false} source="id" style={{display:'none'}}/>
              <TextField label="Имя" source="name" />
              <TextField label="Возраст" sortable={false} source="age" defaultValue={'не указан'}/>
              <EmailField label="Почта" sortable={false} source="email" />
              <TextField label="Провайдер входа" sortable={false} source="providerId" />
              <DateField label="Дата последнего входа" source="lastLogOut" lacales="ru"/>
              <ShowButton label="" />
              <FunctionField
                label=""
                render={(record) => {
                  if (record.id === authUser.id) return <EditButton label="" />;
                }}
              />
            </Datagrid>
          )}
          {!(!isLoading && isAppLoading) && <UserPagination />}
        </ListBase>
      )}
      {!isLoading && isAppLoading && <Loading />}
    </>
  );
};
