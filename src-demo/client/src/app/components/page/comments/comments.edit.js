import * as React from 'react';
import {
  Edit,
  SimpleForm,
  TextInput,
  SelectInput,
  ReferenceInput,
} from 'react-admin';

export const CommentEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="id" />
      <RichTextInput source="text" />
      <ReferenceInput
        label="Post"
        source="post_ref"
        reference="posts"
        // filter={{ isAdmin: true }}
      >
        <SelectInput label="User" optionText="title" />
      </ReferenceInput>
    </SimpleForm>
  </Edit>
);
