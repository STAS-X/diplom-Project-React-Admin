// in src/User.js
import * as React from 'react';
// tslint:disable-next-line:no-var-requires
import {
  Datagrid,
  List,
  Show,
  Create,
  Edit,
  Filter,
  SimpleShowLayout,
  SimpleForm,
  TextField,
  TextInput,
  ListButton,
  ShowButton,
  EditButton,
  DeleteButton,
  FormGroupContextProvider,
  SaveButton,
  Toolbar,
  useEditController,
  EditContextProvider,
  useFormGroup,
  minLength,
  useNotify,
  useRefresh,
  useRedirect,
} from 'react-admin';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@material-ui/core';
import ExpandMore from '@material-ui/icons/ExpandMore';

const UserFilter = (props) => (
  <Filter {...props}>
    <TextInput label="Search" source="name" alwaysOn />
  </Filter>
);

export const UserList = (props) => {
  const onSuccess = ({data}) => {
    console.log(data, 'Custom success');
    // do something
  };
  const onFailure = (err) => {
    console.log(err, 'Custom failed');
    // do something
  };
  const onError = ({err}) => {
    console.log(err, 'Custom error');
    // do something
  };
  return (
    <List
      {...props}
      filters={<UserFilter />}
      sx={{
        backgroundColor: 'yellow',
        '& .RaList-main': {
          backgroundColor: 'red',
        },
      }}
      onError={onError}
    >
      <Datagrid>
        <TextField source="name" />
        <TextField source="age" />
        <TextField source="createdate" />
        <TextField source="lastupdate" />
        <ShowButton label="" />
        <EditButton label="" />
        <DeleteButton label="" redirect={false} />
      </Datagrid>
    </List>
  );
};

export const UserShow = (props) => (
  <Show {...props} title="Users page">
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="age" />
    </SimpleShowLayout>
  </Show>
);

export const UserCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="id" />
      <TextInput source="name" />
      <TextInput source="age" />
    </SimpleForm>
  </Create>
);

const AccordionSectionTitle = ({ children, name }) => {
  const formGroupState = useFormGroup(name);

  return (
    <Typography
      color={
        formGroupState.invalid && formGroupState.dirty ? 'error' : 'inherit'
      }
    >
      {children}
    </Typography>
  );
};

const PostCreateToolbar = (props) => (
  <Toolbar {...props}>
    <SaveButton
      label="post.action.save_and_show"
      redirect="show"
      submitOnEnter={true}
    />
    <SaveButton
      label="post.action.save_and_add"
      redirect={false}
      submitOnEnter={false}
      variant="text"
    />
  </Toolbar>
);

const PostEditActions = () => (
  <TopToolbar>
    <ListButton />
    <ShowButton />
  </TopToolbar>
);

const MyEdit = (props) => {
  const controllerProps = useEditController(props);
  const {
    basePath, // deduced from the location, useful for action buttons
    defaultTitle, // the translated title based on the resource, e.g. 'Post #123'
    error, // error returned by dataProvider when it failed to fetch the record. Useful if you want to adapt the view instead of just showing a notification using the `onFailure` side effect.
    loaded, // boolean that is false until the record is available
    loading, // boolean that is true on mount, and false once the record was fetched
    record, // record fetched via dataProvider.getOne() based on the id from the location
    redirect, // the default redirection route. Defaults to 'list'
    resource, // the resource name, deduced from the location. e.g. 'posts'
    save, // the update callback, to be passed to the underlying form as submit handler
    saving, // boolean that becomes true when the dataProvider is called to update the record
    version, // integer used by the refresh feature
  } = controllerProps;
  console.log(record);
  return (
    <EditContextProvider value={controllerProps}>
      <div>
        <h2>Новый титл для формы редактирования</h2>
        {React.cloneElement(props.children, {
          basePath,
          record: { ...record, name: 'Test XXX', age: 40 },
          redirect,
          resource,
          save,
          saving,
          version,
        })}
      </div>
    </EditContextProvider>
  );
};

export const UserEdit = (props) => {
  const notify = useNotify();
  const refresh = useRefresh();
  const redirect = useRedirect();

  const onSuccess = () => {
    notify(`Изменения были применены успешно`);
    redirect('/#/posts');
    refresh();
  };

  return (
    <MyEdit onSuccess={onSuccess} {...props}>
      <SimpleForm
        toolbar={<PostCreateToolbar />}
        actions={<PostEditActions />}
        submitOnEnter={true}
        variant="standard"
        margin="normal"
      >
        <TextInput disabled source="id" />
        <TextInput disabled source="createdate" />
        <TextInput disabled source="lastupdate" />
        <TextInput source="name" />
        <TextInput source="age" />
        <FormGroupContextProvider name="options">
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls="options-content"
              id="options-header"
            >
              <AccordionSectionTitle name="options">
                Options
              </AccordionSectionTitle>
            </AccordionSummary>
            <AccordionDetails
              id="options-content"
              aria-labelledby="options-header"
              variant="outlined"
            >
              <TextInput source="teaser" validate={minLength(20)} />
              <TextInput
                source="sample"
                validate={minLength(10)}
                style={{ marginLeft: '10px', marginRight: '10px' }}
              />
              <TextInput source="tester" validate={minLength(15)} />
            </AccordionDetails>
          </Accordion>
        </FormGroupContextProvider>
      </SimpleForm>
    </MyEdit>
  );
};
