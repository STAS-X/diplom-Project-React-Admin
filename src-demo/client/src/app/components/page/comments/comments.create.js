import * as React from 'react';
import {
  Create,
  SimpleForm,
  TextInput,
  DateInput,
  ChipField,
  SelectInput,
  ReferenceInput,
  AutocompleteArrayInput,
} from 'react-admin';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { green, blue } from '@mui/material/colors';
import DeleteIcon from '@material-ui/icons/Delete';
import RichTextInput from 'ra-input-rich-text';
import { makeStyles, createStyles } from '@material-ui/core/styles';


export const CommentCreate = (props) => {
  const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
  const dateParseRegex = /(\d{4})-(\d{2})-(\d{2})/;

  const convertDateToString = (value) => {
    // value is a `Date` object
    if (!(value instanceof Date) || isNaN(value.getDate())) return '';
    const pad = '00';
    const yyyy = value.getFullYear().toString();
    const MM = (value.getMonth() + 1).toString();
    const dd = value.getDate().toString();
    return `${yyyy}-${(pad + MM).slice(-2)}-${(pad + dd).slice(-2)}`;
  };

  const dateFormatter = (value) => {
    // null, undefined and empty string values should not go through dateFormatter
    // otherwise, it returns undefined and will make the input an uncontrolled one.
    if (value == null || value === '') return '';
    if (value instanceof Date) return convertDateToString(value);
    // Valid dates should not be converted
    if (dateFormatRegex.test(value)) return value;

    return convertDateToString(new Date(value));
  };



  const handleClick = () => {
    console.info('You clicked the Chip.');
  };

  const handleDelete = () => {
    console.info('You clicked the delete icon.');
  };

  const autoRef = React.useRef();
  const handlerChange = ({target}) => {
  console.log(target, autoRef.current,'event change');
}

  return (
    <Create {...props}>
      <SimpleForm>
        {/* <ChipField
          sx={{
            label: 'Custom delete icon',
            onClick: { handleClick },
            onDelete: { handleDelete },
            deleteIcon: <DeleteIcon />,
            bgcolor: 'red',
            variant: 'outlined',
          }}
          source="publishing_state"
        />
         <AutocompleteArrayInput
    ref={autoRef}
    source="tags"

    onSelect={handlerChange}
    matchSuggestion={(filterValue, suggestion) => true}
    options={{ color: 'primary' }}

    color="primary"
    choices={[
      { id: 'programming', name: 'Programming' },
      { id: 'lifestyle', name: 'Lifestyle' },
      { id: 'photography', name: 'Photography' },
    ]}
  /> */}
        <DateInput
          label={false}
          helperText="Дата создания коммента"
          source="publish"
          format={dateFormatter}
          parse={convertDateToString}
          defaultValue={new Date()}
        />
        <RichTextInput label="Body" source="body" />
        <ReferenceInput
          label="Post"
          source="test"
          target="userId"
          reference="users"
          // filter={{ isAdmin: true }}
        >
          <SelectInput label="User" optionText="name"  />
        </ReferenceInput>
      </SimpleForm>
    </Create>
  );
};
