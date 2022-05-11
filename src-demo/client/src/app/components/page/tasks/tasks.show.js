import * as React from "react";
import {
  Show,
  SimpleShowLayout,
  TextField,
  RichTextField,
  FileField,

} from "react-admin";


export const TaskShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="createdate" />
      <TextField source="lastupdate" />
      <TextField source="title" />
      <RichTextField source="body" />
    </SimpleShowLayout>
  </Show>
);
