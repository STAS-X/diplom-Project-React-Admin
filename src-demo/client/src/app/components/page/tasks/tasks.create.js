import * as React from "react";
import {
  Create,
  ImageField,
  ImageInput,
  SimpleForm,
  TextInput,
  SelectInput,
  ReferenceInput,
  FileInput,
  FileField,
  ArrayInput,
  SimpleFormIterator,
  DateInput,
} from "react-admin";
import RichTextInput from "ra-input-rich-text";


export const TaskCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="id" />
      <TextInput source="title" />
      <RichTextInput source="body" />
      <DateInput source="date" parse={val => new Date(val)} />
      <ReferenceInput
        label="User Id"
        source="user_id"
        reference="users"
        // filter={{ isAdmin: true }}
      >
        <SelectInput optionText="name" />
      </ReferenceInput>
      {/*<ReferenceInput
        label="User Ref"
        source="user_ref.___refid"
        reference="users"
      >
        <SelectInput optionText="name" />
      </ReferenceInput>
       Or use the easier <FirebaseReferenceInput>
       <FirebaseReferenceInput
        label="User Ref (Firebase)"
        source="user_ref"
        reference="users"
      >
        <SelectInput optionText="name" />
      </FirebaseReferenceInput> */}
      <FileInput source="files_multiple" multiple label="Files with (multiple)">
        <FileField source="src" title="title" />
      </FileInput>
      <ArrayInput source="files">
        <SimpleFormIterator>
          <FileInput source="file" label="Array Form Files">
            <FileField source="src" title="title" />
          </FileInput>
        </SimpleFormIterator>
      </ArrayInput>
      <ArrayInput source="sections.mySection.items" label="Section items">
        <SimpleFormIterator>
          <TextInput source="name" label="Name" />
          <ImageInput source="image" label="Image" accept="image/*">
            <ImageField source="src" title="title" />
          </ImageInput>
        </SimpleFormIterator>
      </ArrayInput>
    </SimpleForm>
  </Create>
);
