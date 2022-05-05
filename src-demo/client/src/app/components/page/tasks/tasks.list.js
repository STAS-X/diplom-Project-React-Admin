import * as React from "react";
import {useSelector} from 'react-redux';
import {useEffect} from 'react';
import {
  Datagrid,
  List,
  TextField,
  ShowButton,
  EditButton,
  DeleteButton,
  RichTextField,
  ReferenceField,
  useGetOne
} from "react-admin";
import Loading from '../../ui/loading/loading';
import Typography from '@mui/material/Typography';
import TaskAsideCard from '../../common/cards/task.card.aside';
import { useListContext } from 'react-admin';

const Aside = ({ id }) => {
    //const { data, isLoading } = useGetOne('tasks', {id: "1"});
    const { data } = id ? useGetOne('tasks', id) : { data: {title: 'not found'} };
   
    return (
      // <div className="aside" style={{ width: id?'200px':'0px', opacity: id?1:0, marginLeft: '1.6em',  transition: '300ms ease-out' }} >
      //     <Typography variant="h6">Posts stats</Typography>
      //     <Typography variant="body2">
      //         Current post title: {data?.title}
      //     </Typography>
      // </div>
      <TaskAsideCard
        id={id}
      />
    );
};

export const TaskList = (props) => {

const [hoverId, setHoverId]=React.useState();
//const [isTransition, setTransition]=React.useState(false);


 const handleUpdateId = (id) => {
   setHoverId(id);
 }

 const handleMouseEnter = ({target})=> {
   if (target.closest('tr') && !target.closest('td')?.classList.contains('column-undefined') && target.closest('tr').querySelector('td.column-id')) {
     if (hoverId !== target.closest('tr').querySelector('td.column-id').textContent) {
     handleUpdateId(target.closest('tr').querySelector('td.column-id').textContent);
     //setTransition(true);
     }
   }

 }

//const { total, isLoading } = useListContext();
const { loadedOnce:isLoading } = useSelector((state) => state.admin.resources.tasks.list);

 return (
   <>
     <List
       {...props}
       aside={<TaskAsideCard id={hoverId} />}
       style={!isLoading ? { height: '0px' } : {}}
     >
       <Datagrid
         onMouseMove={handleMouseEnter}
         onMouseLeave={() => {
           setTimeout(() => handleUpdateId(null), 0);
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
     {!isLoading && <Loading />}
   </>
 );
}

