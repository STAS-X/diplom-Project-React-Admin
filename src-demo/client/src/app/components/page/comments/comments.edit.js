import * as React from 'react';
import {
  Edit,
  SimpleForm,
  TextInput,
  SelectInput,
  ReferenceInput,
} from 'react-admin';
import RichTextInput from 'ra-input-rich-text';

export const CommentEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput disabled source="id" />
      <TextInput source="publishing_state" />
      <RichTextInput source="body" />
      <ReferenceInput
        label="Post"
        source="postto"
        reference="users"
        // filter={{ isAdmin: true }}
      >
        <SelectInput label="User" optionText="name" />
      </ReferenceInput>
    </SimpleForm>
  </Edit>
);
