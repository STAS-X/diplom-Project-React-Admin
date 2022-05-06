// in src/User.js
import * as React from 'react';
// tslint:disable-next-line:no-var-requires
import { useSelector } from 'react-redux';
import Loading from '../../ui/loading/loading';
import { green, blue, red } from '@mui/material/colors';
import {
  Datagrid,
  DatagridBody,
  DatagridHeader,
  List,
  Filter,
  TextField,
  TextInput,
  ShowButton,
  EditButton,
  FunctionField,
  RecordContextProvider,
  useRecordContext,
} from 'react-admin';
import { TableHead, TableCell, TableRow, Checkbox } from '@mui/material';
import UserCardExpand from '../../common/cards/user.card.expand';
import { getAuthData } from '../../../store/authcontext';

// const MyDatagridRow = ({
//   record,
//   id,
//   onToggleItem,
//   children,
//   selected,
//   selectable,
// }) => (
//   <RecordContextProvider value={record}>
//     <TableRow style={{ backgroundColor: 'red' }}>
//       {/* first column: selection checkbox */}
//       <TableCell padding="none">
//         <Checkbox
//           disabled={selectable}
//           checked={selected}
//           onClick={(event) => onToggleItem(id, event)}
//         />
//       </TableCell>
//       {/* data columns based on children */}
//       {React.Children.map(children, (field) => {
//         console.log(id, field);
//         return (
//           <TableCell key={`${id}-${field.props.source}`}>{field}</TableCell>
//         );
//       })}
//     </TableRow>
//   </RecordContextProvider>
// );

// const MyDatagridHeader = ({ children }) => (
//   <TableHead>
//     <TableRow>
//       <TableCell>
//         <Checkbox />
//       </TableCell>{' '}
//       {/* empty cell to account for the select row checkbox in the body */}
//       {React.Children.map(children, (child) => (
//         <TableCell key={child.props.source}>{child.props.source}</TableCell>
//       ))}
//     </TableRow>
//   </TableHead>
// );

// const MyDatagridBody = (props) => (
//   <DatagridBody {...props} row={<MyDatagridRow />} />
// );
// const MyDatagrid = (props) => (
//   <Datagrid
//     {...props}
//     header={<MyDatagridHeader />}
//     body={<MyDatagridBody />}
//   />
// );

const UserFilter = (props) => (
  <Filter {...props}>
    <TextInput label="Search" source="name" alwaysOn />
  </Filter>
);

const UserExpandData = () => {
  const record = useRecordContext();

  return <div dangerouslySetInnerHTML={{ __html: record.providerId }} />;
};

export const UserList = (props) => {
  const [userUid, setUserUid] = React.useState();
  let uid = null;
  const userRef = React.useRef();

  const { loadedOnce: isLoading } = useSelector(
    (state) => state.admin.resources.users.list
  );

  const { user: authUser } = useSelector(getAuthData());

  const postRowStyle = (uid) => (record, index) => {
    
    return {
      backgroundColor: record.uid === uid ? green[200] : red[100],
    };
  };


  React.useEffect(() => {
    const userList = userRef.current;

    if (userList) {
      const ths = userList.querySelectorAll('thead>tr>th');
      for (const userTh of ths) userTh.style.backgroundColor = blue[100];
    }
    return () => {};
  }, [userRef.current]);

  return (
    <>
      <List
        {...props}
        filters={<UserFilter />}
        style={!isLoading ? { height: '0px' } : {}}
      >
        <Datagrid
          ref={userRef}
          isRowExpandable={(row) => row.uid === authUser.uid}
          rowStyle={postRowStyle(authUser?.uid)}
          expand={<UserCardExpand />}
        >
          <TextField source="name" />
          <TextField source="age" />
          <TextField source="email" />
          <TextField source="uid" />
          <TextField source="providerId" />
          <TextField source="lastLogOut" />
          <ShowButton label="" />
          <FunctionField
            label=""
            render={(record) => {
              if (record.uid === authUser.uid) return <EditButton label="" />;
            }}
          />
        </Datagrid>
      </List>
      {!isLoading && <Loading />}
    </>
  );
};
