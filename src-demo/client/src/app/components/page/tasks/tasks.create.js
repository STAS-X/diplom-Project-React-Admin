import * as React from "react";
import {useSelector} from "react-redux";
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
  useCreate,
  useNotify,
  useRedirect,
  DateInput,
} from "react-admin";
import RichTextInput from "ra-input-rich-text";
import { getAuthData } from '../../../store/authcontext';



export const TaskCreate = (props) => {
    const { user: authUser } = useSelector(getAuthData());
    const notify = useNotify();
    const redirect = useRedirect();

    const transform = (data) => ({ ...data, userId: authUser.id});

    const onSuccess = ({data}) => {
      notify(`Task '${data.id}' created successfully`); // default message is 'ra.notification.created'
      redirect('show', '/tasks', data.id, data);
    };
  return (
    <Create {...props} onSuccess={onSuccess} transform={transform}>
      <SimpleForm>
        <TextInput disabled source="id" />
        <TextInput source="title" defaultValue={'Пример заголовка'} />
        <RichTextInput source="body" defaultValue={'Пример описания'} />
        <DateInput
          source="created"
          parse={(val) => new Date(val)}
          defaultValue={new Date()}
        />
        <ReferenceInput
          label="User Id"
          source="userId"
          reference="users"
          defaultValue={'1'}
          // filter={{ isAdmin: true }}
        >
          <SelectInput optionText="name" />
        </ReferenceInput>
      </SimpleForm>
    </Create>
  );};
