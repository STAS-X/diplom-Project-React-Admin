import * as React from 'react';
import { useSelector } from 'react-redux';
import {
  Datagrid,
  List,
  TextField,
  ShowButton,
  EditButton,
  DeleteButton,
  RichTextField,
  ReferenceField,
} from 'react-admin';
import Loading from '../../ui/loading/loading';

export const CommentList = (props) => {

  const { loadedOnce:isLoading } = useSelector((state) => state.admin.resources.comments.list);
  return (
    <>
      <List {...props} style={!isLoading ? { height: '0px' } : {}}>
        <Datagrid>
          <TextField source="id" />
          <TextField source="updatedby" />
          <TextField source="createdby" />
          <RichTextField source="text" />
          <ReferenceField label="Post" source="post_ref" reference="tasks">
            <TextField source="title" />
          </ReferenceField>
          <ShowButton label="" />
          <EditButton label="" />
          <DeleteButton label="" redirect={false} />
        </Datagrid>
      </List>
      {!isLoading && <Loading />}
    </>
  );
  };
