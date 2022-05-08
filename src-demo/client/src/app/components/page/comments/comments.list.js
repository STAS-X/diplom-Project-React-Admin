import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { green, blue, red } from '@mui/material/colors';
import {
  Datagrid,
  ListBase,
  TextField,
  ShowButton,
  EditButton,
  DeleteButton,
  RichTextField,
  FilterButton,
  FilterForm,
  CreateButton,
  Pagination,
  DateField,
  TextInput,
  SortButton,
  useGetOne,
  useListContext,
  useTranslate
} from 'react-admin';
import { Stack, Chip } from '@mui/material';
import Loading from '../../ui/loading/loading';
import CommentAsideCard from '../../common/cards/comment.card.aside';
import { getAuthData } from '../../../store/authcontext';
import { getAppColorized, getAppLoading } from '../../../store/appcontext';

import { Button } from '@mui/material';
import ContentFilter from '@material-ui/icons/FilterList';

const Aside = ({ id }) => {
  //const { data, isLoading } = useGetOne('comments', {id: "1"});
  const { data } = id
    ? useGetOne('comments', id)
    : { data: { title: 'not found' } };

  return (
    // <div className="aside" style={{ width: id?'200px':'0px', opacity: id?1:0, marginLeft: '1.6em',  transition: '300ms ease-out' }} >
    //     <Typography variant="h6">Posts stats</Typography>
    //     <Typography variant="body2">
    //         Current post title: {data?.title}
    //     </Typography>
    // </div>
    <CommentAsideCard id={id} />
  );
};

const PostFilterButton = (props) => {
  const { showFilter } = useListContext();
  return (
    <Button {...props}
      size="small"
      color="primary"
      onClick={() => showFilter('main')}
      startIcon={<ContentFilter />}
    >
      Filter
    </Button>
  );
};

const QuickFilter = ({ label }) => {
  const translate = useTranslate();
  return <Chip sx={{ marginBottom: 1 }} label={translate(label)} />;
};

const CommentPagination = () => (
  <Pagination rowsPerPageOptions={[10, 25, 50, 100]} />
);


function dateWithMonths(months) {
  const date = new Date();
  date.setMonth(date.getMonth() + months);

  return date.toISOString().slice(0, 10);
}

const commentFilters = [
  <TextInput label="Search" source="q" alwaysOn />,
  <TextInput
    label="Title"
    resettable
    source="title"
    defaultValue="Hello, World!"
  />,
  <QuickFilter
    source="publish_gte"
    label="Last month"
    defaultValue={dateWithMonths(-1)}
  />,
  <QuickFilter
    source="publish_lte"
    label="Least month"
    defaultValue={dateWithMonths(-1)}
  />,
  <QuickFilter
    source="id"
    label="By current user"
    defaultValue={'DTGCdToJ3SloFowi6ffX'}
  />,
];

const CommentToolbar = () => (
  <Stack direction="row" justifyContent="space-between">
    <FilterForm filters={commentFilters} />
    <div>
      <SortButton fields={['title', 'publish', 'publishing_state']} />
      <FilterButton  filters={commentFilters} />
      <CreateButton />
    </div>
  </Stack>
);

export const CommentList = (props) => {
  const commentRef = React.useRef();
  const commentList = commentRef.current;

  const { user: authUser } = useSelector(getAuthData());

  const isAppColorized = useSelector(getAppColorized());
  const isAppLoading = useSelector(getAppLoading());

  const [hoverId, setHoverId] = React.useState();
  //const [isTransition, setTransition]=React.useState(false);

  const handleUpdateId = (id) => {
    setHoverId(id);
  };

  const handleMouseEnter = ({ target }) => {
    if (
      target.closest('tr') &&
      !target.closest('td')?.classList.contains('column-undefined') &&
      target.closest('tr').querySelector('td.column-id')
    ) {
      if (
        hoverId !==
        target.closest('tr').querySelector('td.column-id').textContent
      ) {
        handleUpdateId(
          target.closest('tr').querySelector('td.column-id').textContent
        );
        //setTransition(true);
      }
    }
  };

  React.useEffect(() => {
    if (commentList) {
      const ths = commentList.querySelectorAll('thead>tr>th');
      for (const commentTh of ths)
        commentTh.style.backgroundColor = isAppColorized
          ? blue[100]
          : 'whitesmoke';
      const paging = commentList.nextSibling?.querySelector('div.MuiToolbar-root')
      if (paging)
        paging.style.backgroundColor = isAppColorized
          ? blue[200]
          : 'whitesmoke';
    }
    return () => {};
  }, [commentList, isAppColorized, authUser]);

  const { loadedOnce: isLoading } = useSelector(
    (state) => state.admin.resources.comments.list
  );

  const commentRowStyle = (id) => (record, index) => {
    return {
      backgroundColor: record.userId === id ? green[200] : red[100],
    };
  };


  return (
    <>
      {authUser && (
        <ListBase {...props} sort={{ field: 'publish', order: 'ASC' }}
          aside={<CommentAsideCard id={hoverId} />}
          style=
          {!isLoading && isAppLoading ? { height: '0px', display: 'none' } : {}}
          >{!(!isLoading && isAppLoading) && <CommentToolbar />}
          {!(!isLoading && isAppLoading) && (
            <Datagrid
              onMouseMove={handleMouseEnter}
              onMouseLeave={() => {
                setTimeout(() => handleUpdateId(null), 0);
              }}
              ref={commentRef}
              rowStyle={
                isAppColorized ? commentRowStyle(authUser.id) : () => {}
              }
            >
              <TextField source="id" />
              <TextField source="title" />
              <DateField source="publish" />
              <TextField source="createdby" />
              <RichTextField source="body" />
              <ShowButton label="" />
              <EditButton label="" />
              <DeleteButton label="" redirect={false} />
            </Datagrid>
          )}
          {!(!isLoading && isAppLoading) && <CommentPagination />}
        </ListBase>
      )}
      {!isLoading && isAppLoading && <Loading />}
    </>
  );
};
