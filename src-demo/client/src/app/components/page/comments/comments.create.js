import * as React from 'react';
import {
  Create,
  SimpleForm,
  TextInput,
  SelectInput,
  ReferenceInput,
} from 'react-admin';

export const CommentCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="id" />
      <RichTextInput source="text" />
      <ReferenceInput
        label="Post"
        source="_DOCREF_post_ref"
        reference="posts"
        // filter={{ isAdmin: true }}
      >
        <SelectInput label="User" optionText="title" />
      </ReferenceInput>
    </SimpleForm>
  </Create>
);
