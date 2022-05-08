// in src/User.js
import * as React from 'react';
// tslint:disable-next-line:no-var-requires
import {
  Show,
  SimpleShowLayout,
  TextField,

} from 'react-admin';

export const UserShow = (props) => (
  <Show {...props} title="Users page">
    <SimpleShowLayout>
      <TextField source="name" />
      <TextField source="age" />
      <TextField source="email" />
      <TextField source="id" />
      <TextField source="providerId" />
      <TextField source="lastLogOut" />
    </SimpleShowLayout>
  </Show>
);
