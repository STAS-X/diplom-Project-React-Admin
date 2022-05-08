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

return (
  <Show {...props}>
    <TabbedShowLayout syncWithLocation={false}>
      <Tab label="summary" path="users">
        <TextField label="Id" source="id" />
        <TextField source="name" />
        <TextField source="email" />
      </Tab>
      <Tab label="body" path="users">
        <RichTextField source="name" label="richBody" />
      </Tab>
      <Tab label="Miscellaneous" path="tasks">
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
      <Tab label="tasks">
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
      <Tab label="comments">
        <ReferenceManyField
          sort={{ field: 'publishAt', order: 'ASC' }}
          perPage={10}
          reference="comments"
          target="userId"
          label="Refmanycomment"
        >
          <Datagrid>
            <TextField source="body" />
            <TextField source="publishing_state" />
            <DateField
              locales="ru-Ru"
              options="{ dateStyle: 'long', timeStyle: 'medium' }"
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

