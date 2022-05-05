// in src/User.js
import * as React from 'react';
// tslint:disable-next-line:no-var-requires
import { useSelector } from 'react-redux';
import Loading from '../../ui/loading/loading';
import {
  Datagrid,
  List,
  Filter,
  TextField,
  TextInput,
  ShowButton,
  EditButton,
} from 'react-admin';

const UserFilter = (props) => (
  <Filter {...props}>
    <TextInput label="Search" source="name" alwaysOn />
  </Filter>
);

export const UserList = (props) => {
  const onError = (err) => {
    console.log(err, 'Custom error');
    // do something
  };
  const { loadedOnce: isLoading } = useSelector((state) => state.admin.resources.users.list);
  
  return (
    <>
      <List
        {...props}
        filters={<UserFilter />}
        sx={{
          backgroundColor: 'yellow',
          '& .RaList-main': {
            backgroundColor: 'red',
          },
        }}
        style={!isLoading ? { height: '0px' } : {}}
        onError={onError}
      >
        <Datagrid>
          <TextField source="name" />
          <TextField source="age" />
          <TextField source="createdate" />
          <TextField source="lastupdate" />
          <ShowButton label="" />
          <EditButton label="" />
        </Datagrid>
      </List>
      {!isLoading && <Loading />}
    </>
  );
};
