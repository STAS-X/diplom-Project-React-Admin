import * as React from "react";
import {useSelector} from 'react-redux';
import {useEffect} from 'react';
import {
  Datagrid,
  List,
  Show,
  Create,
  Edit,
  Filter,
  DateField,
  ImageField,
  ImageInput,
  SimpleShowLayout,
  SimpleForm,
  TextField,
  TextInput,
  ShowButton,
  EditButton,
  DeleteButton,
  RichTextField,
  ReferenceField,
  SelectInput,
  ReferenceInput,
  FileInput,
  FileField,
  ArrayInput,
  SimpleFormIterator,
  DateInput,
  useGetOne
} from "react-admin";
import Typography from '@mui/material/Typography';
import RichTextInput from "ra-input-rich-text";
import Button from '@mui/material/Button';
import { useListContext } from 'react-admin';

import { FirebaseReferenceField, FirebaseReferenceInput } from '../../common/reference/FirebaseReferenceFields';


const Aside = ({ id, isTransition, onTransition}) => {
    //const { data, isLoading } = useGetOne('posts', {id: "1"});
    console.log(id, isTransition)
    const { data, isLoading } = id ? useGetOne('posts', id ) : { data: null, isLoading: false};
    if (isLoading) return <Loading/>;
   
    return (
        <div className="aside" style={{ width: id || isTransition?'300px':'0px', opacity: id || isTransition?1:0, margin: '1em',  transition: 'width 300ms ease-out, opacity 300ms ease-out' }} onTransitionEnd={onTransition}>
            <Typography variant="h6">Posts stats</Typography>
            <Typography variant="body2">
                Current post title: {data?.title}
            </Typography>
        </div>
    );
};

export const PostList = (props) => {

const [hoverId, setHoverId]=React.useState();
const [isTransition, setTransition]=React.useState(false);

 const handleTransition = (event) => {
    if (event.propertyName==='width') {
      setTransition(false);
    }
 }

 const handleUpdateId = (id) => {
   setHoverId(id);
 }

 const handleMouseEnter = ({target})=> {
   if (target.closest('tr') && !target.closest('td')?.classList.contains('column-undefined') && target.closest('tr').querySelector('td.column-id')) {
     if (hoverId !== target.closest('tr').querySelector('td.column-id').textContent && !isTransition) {
     handleUpdateId(target.closest('tr').querySelector('td.column-id').textContent);
     setTransition(true);
     }
   }

 }

const { total, isLoading } = useListContext();
 const handleFirebaseGetList = async () => {
   console.log(isLoading, 'Loading');
   try {
     const record = await dataProvider.getList('users123', {
       filter: { age: '22' },
       pagination: { page: 1, perPage: total },
       sort: { field: 'id', order: 'ASC' },
     });
     console.log(record, 'Click on button');
   } catch (error) {
     console.log(error, 'Error occured');
   }
 };

const PostFilter = (props) => (
  <Filter {...props}>
    <TextInput label="Search" source="title" alwaysOn />
  </Filter>
);

const ReferenceFilter = (props) => (
  <Filter {...props}>
    <ReferenceInput
      label="Organization"
      source="user.id"
      reference="users"
      allowEmpty
    >
      <SelectInput optionText="name" />
    </ReferenceInput>
  </Filter>
);
const { loadedOnce } = useSelector((state) => state.admin.resources.posts.list);

useEffect(()=>{

   return () => {}
}, []);


 return (
   <>
     <List
       {...props}
       aside={
         <Aside
           id={hoverId}
           isTransition={isTransition}
           onTransition={handleTransition}
         />
       }
     >
       <Datagrid
         onMouseMove={handleMouseEnter}
         onMouseLeave={() => {
           setTimeout(() => handleUpdateId(null), !isTransition ? 0 : 300);
         }}
       >
         <TextField source="id" />
         <TextField source="title" />
         <TextField source="publishing_state" />
         <TextField source="updatedby" />
         <TextField source="createdby" />
         <RichTextField source="body" />
         <ReferenceField
           label="User Ref"
           source="user_ref.___refid"
           reference="users"
         >
           <TextField source="name" />
         </ReferenceField>
         <ShowButton label="" />
         <EditButton label="" />
         <DeleteButton label="" redirect={false} />
       </Datagrid>
     </List>
     {!loadedOnce && <p>Данные загружаются</p>}
   </>
 );
}

// const ConditionalEmailField = ({}) =>
//   record && record.hasEmail ? (
//     <EmailField source="email" record={record} {...rest} />
//   ) : null;
export const PostShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="createdate" />
      <TextField source="lastupdate" />
      <TextField source="title" />
      <RichTextField source="body" />

      <ReferenceField label="User Id" source="user_id" reference="users">
        <TextField source="name" />
      </ReferenceField>

      <ReferenceField label="User Ref" source="user_ref.___refid" reference="users">
        <TextField source="name" />
      </ReferenceField>
      {/* Or use the easier <FirebaseReferenceField> */}
      <FirebaseReferenceField
        label="User (Reference Doc)"
        source="user_ref"
        reference="users"
      >
        <TextField source="name" />
      </FirebaseReferenceField>

      <FileField
        source="files_multiple.src"
        title="files_multiple.title"
        multiple
      />
    </SimpleShowLayout>
  </Show>
);

export const PostCreate = (props) => (
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
      <ReferenceInput
        label="User Ref"
        source="user_ref.___refid"
        reference="users"
      >
        <SelectInput optionText="name" />
      </ReferenceInput>
      {/* Or use the easier <FirebaseReferenceInput> */}
      <FirebaseReferenceInput
        label="User Ref (Firebase)"
        source="user_ref"
        reference="users"
      >
        <SelectInput optionText="name" />
      </FirebaseReferenceInput>
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

export const PostEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput disabled source="id" />
      <DateField source="createdate" />
      <DateField source="lastupdate" />
      <TextInput source="title" />
      <RichTextInput source="body" />
      <ReferenceInput
        label="User Id"
        source="user_id"
        reference="users"
        // filter={{ isAdmin: true }}
      >
        <SelectInput optionText="name" />
      </ReferenceInput>
      <ReferenceInput
        label="User Ref"
        source="user_ref.___refid"
        reference="users"
      >
        <SelectInput optionText="name" />
      </ReferenceInput>
      <FirebaseReferenceInput
        label="User Ref (Firebase)"
        source="user_ref"
        reference="users"
      >
        <SelectInput optionText="name" />
      </FirebaseReferenceInput>
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
  </Edit>
);
