import * as React from 'react';
import {
  Show,
  SimpleShowLayout,
  TextField,
  RichTextField,
  ReferenceField,
} from 'react-admin';

export const CommentShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="createdate" />
      <TextField source="lastupdate" />
      <RichTextField source="text" />
      <ReferenceField label="Post" source="post_ref" reference="posts">
        <TextField source="title" />
      </ReferenceField>
    </SimpleShowLayout>
  </Show>
);
