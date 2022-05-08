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
  RichTextField,
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

const userFilters = [
  <TextInput label="Search" source="q" alwaysOn />,
  <TextInput
    label="Email"
    resettable
    source="email"
    defaultValue="xxx@xxx.xxx"
  />,
  <QuickFilter
    source="loggedOut_gte"
    label="Last login"
    defaultValue={dateWithMonths(-1)}
  />,
  <QuickFilter
    source="id"
    label="Current user"
    defaultValue={'DTGCdToJ3SloFowi6ffX'}
  />,
];

const UserToolbar = () => (
  <Stack direction="row" justifyContent="space-between">
    <FilterForm filters={userFilters} />
    <div>
      <SortButton fields={['name', 'email', 'loggedOut']} />
      <FilterButton filters={userFilters} />
      <CreateButton />
    </div>
  </Stack>
);

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
  }, [userList, isAppColorized, authUser]);

  return (
    <>
      {authUser && (
        <ListBase {...props} sort={{ field: 'id', order: 'ASC' }}
          style=
          {!isLoading && isAppLoading ? { height: '0px', display: 'none' } : {}}
          >{!(!isLoading && isAppLoading) && <UserToolbar />}
          {!(!isLoading && isAppLoading) && (
            <Datagrid
              ref={userRef}
              isRowExpandable={(row) =>
                authUser ? row.id === authUser.id : false
              }
              rowStyle={isAppColorized ? postRowStyle(authUser.id) : () => {}}
              expand={<UserCardExpand />}
            >
              <TextField source="id" />
              <TextField source="name" />
              <TextField source="age" />
              <TextField source="email" />
              <TextField source="providerId" />
              <TextField source="lastLogOut" />
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
