import * as React from 'react';
import {
  Show,
  SimpleShowLayout,
  TextField,
  RichTextField,
  ChipField,
} from 'react-admin';
import DeleteIcon from '@material-ui/icons/DeleteRounded';

export const CommentShow = (props) => {

    const handleClick = () => {
      console.info('You clicked the Chip.');
    };

    const handleDelete = () => {
      console.info('You clicked the delete icon.');
    };

  return (
    <Show {...props}>
      <SimpleShowLayout>
        <TextField source="id" />
        <ChipField
          sx={{
            label: 'Custom delete icon',
            onClick: { handleClick },
            onDelete: { handleDelete },
            deleteIcon: <DeleteIcon />,
            bgcolor: 'red',
            variant: 'outlined',
          }}
          clickable={true}
          color="primary"
          bgcolor="red"
          component="span"
          onClick={()=>handleClick()}
          avatar={<DeleteIcon />}
          deleteIcon={<DeleteIcon />}
          source="publishing_state"
        />
        <RichTextField source="body" />
      </SimpleShowLayout>
    </Show>
  );};
