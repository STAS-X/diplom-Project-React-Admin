import { useThemeProps } from '@mui/material';
import {
  Show,
  TabbedShowLayout,
  Tab,
  TextField,
  RichTextField,
  DateField,
  NumberField,
  BooleanField,
  EditButton,
  ReferenceManyField,
  Datagrid,
} from 'react-admin';

export const UserTabbetShow = (props) => {
  console.log(props, 'current props')
  const { pathname } = props.history.location;
  if (pathname.slice(-4)==="show") props.history.location.pathname = props.history.location.pathname+'/users';

  //if (newPath.slice(-4)==="show")

return (
  <Show {...props}>
    <TabbedShowLayout
      syncWithLocation={true}
      variant="scrollable"
      //scrollButtons="auto"
      spacing={2}
    >
      <Tab label="summary" path="users">
        <TextField label="Id" source="id" />
        <TextField source="name" />
        <TextField source="email" />
        <TextField label="Props" />
      </Tab>
      <Tab label="body" path="card" value={2}>
        <RichTextField source="name" label="richBody" />
      </Tab>
      <Tab label="Miscellaneous" path="body" value={3}>
        <TextField label="Body" source="body" />
        <DateField label="Publication date" source="published_at" />
        <NumberField source="id" />
        <BooleanField
          label="Allow comments?"
          source="commentable"
          defaultValue
        />
        <TextField label="Created by" source="createdBy" />
      </Tab>
      <Tab label="tasks" path="tasks">
        <ReferenceManyField
          sort={{ field: 'publishAt', order: 'ASC' }}
          perPage={10}
          reference="tasks"
          target="userId"
          label="Refmanytasks"
        >
          <Datagrid>
            <TextField source="progress" />
            <TextField source="title" />
            <TextField source="description" />
            <DateField
              locales="ru-Ru"
              showTime={true}
              options={{ dateStyle: 'long', timeStyle: 'medium' }}
              source="publishAt"
            />
            <TextField source="description" />
            <EditButton />
          </Datagrid>
        </ReferenceManyField>
      </Tab>
      <Tab label="comments" value={5} path="comments">
        <ReferenceManyField
          sort={{ field: 'publishAt', order: 'ASC' }}
          perPage={10}
          reference="comments"
          target="userId"
          label={`Таблица с комментариями пользователя ${props.id}`}
        >
          <Datagrid>
            <TextField source="body" />
            <TextField source="publishing_state" />
            <DateField
              locales="ru-Ru"
              options={{ dateStyle: 'long', timeStyle: 'medium' }}
              source="publishAt"
            />
            <EditButton />
          </Datagrid>
        </ReferenceManyField>
      </Tab>
    </TabbedShowLayout>
  </Show>
);
};

