import * as React from 'react';
import {
  Show,
  useShowContext,
  SimpleShowLayout,
  TextField,
  RichTextField,
  ChipField,
} from 'react-admin';
import { Divider } from '@mui/material';
import DeleteIcon from '@material-ui/icons/DeleteRounded';

const PostShowLayout = () => {
  const {
    defaultTitle, // the translated title based on the resource, e.g. 'Post #123'
    error, // error returned by dataProvider when it failed to fetch the record. Useful if you want to adapt the view instead of just showing a notification using the `onError` side effect.
    isFetching, // boolean that is true while the record is being fetched, and false once the record is fetched
    isLoading, // boolean that is true until the record is available for the first time
    record, // record fetched via dataProvider.getOne() based on the id from the location
    refetch, // callback to refetch the record via dataProvider.getOne()
    resource, // the resource name, deduced from the location. e.g. 'posts'
  } = useShowContext();

  //const [isPublished, setPublished] = React.useState(false);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error!</div>;
  }

    const handleClick = () => {
      console.info('You clicked the Chip.');
    };

    const handleDelete = () => {
      console.info('You clicked the delete icon.');
    };

  const isPublished=(new Date(record.publish)>new Date('2022-05-01'));

  return (
    <>
      <h1>{defaultTitle}</h1>
      <SimpleShowLayout spacing={2} divider={<Divider flexItem />}>
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
          onClick={() => handleClick()}
          avatar={<DeleteIcon />}
          deleteIcon={<DeleteIcon />}
          source="publishing_state"
        />
        {isPublished && <RichTextField source="body" />}
      </SimpleShowLayout>
    </>
  );
};

export const CommentShow = (props) => {

  return (
    <Show {...props}>
      <PostShowLayout />
    </Show>
  );};
