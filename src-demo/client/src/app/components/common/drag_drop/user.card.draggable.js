import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import styled from "styled-components";
import UserCard from '../cards/user.card.list';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Stack } from '@mui/material';

const rowCards=4;

const reorder = (list, startIndex, endIndex) => {
  console.log(list, startIndex, endIndex, 'drag drop information');
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  let visaVersa =[];
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  if (destClone.length === rowCards) {
     [visaVersa] = destClone.splice(droppableDestination.index, 1);  
     sourceClone.splice(droppableSource.index, 0, visaVersa);
  }

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;
  return result;
};

//const grid=8;

// const getItemStyle = (isDragging, draggableStyle) => ({
//   // some basic styles to make the items look a bit nicer
//   userSelect: 'none',
//   padding: grid * 2,
//   margin: `0 0 ${grid}px 0`,

//   // change background colour if dragging
//   ...(isDragging? {background: 'black'}:{}),

//   // styles we need to apply on draggables
//   ...draggableStyle
// });

function UserDragCard({ data, index }) {
  return (
    <Draggable draggableId={data.id} index={index}>
      {(provided, snapshot) => {
        return (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}

        >
          <UserCard record={data} isDragging={snapshot.isDragging}/>
        </div>)
        }}
    </Draggable>
  );
}

const UserDragStack  = React.memo(function UserDragStack({ users }) {
  console.info(users, 'get users from drag list');
  return users.map((user, index) => (
    <UserDragCard data={user} index={index} key={user.id} />
  ));
});

const UserDraggableComponent = ({ list: users, ids }) => {

  const [state, setState] = useState(null);
  const usersByRows = {}

   React.useEffect(()=>{
  //if (!state) {
    for (let num=0; (num+1)*rowCards<=users.length; num++ ) {
      usersByRows[`draglist${num+1}`]=users.slice(num*rowCards, (num+1)*rowCards)
    }
    setState(usersByRows);
  //}
  return ()=>{ console.log(state, 'unmount')}
  }, [ids]);

  function onDragEnd(result) {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
        const items = reorder(
        state[source.droppableId],
        source.index,
        destination.index
      );

      setState(prev => {return {...prev, [source.droppableId]:items}});
    } else if (destination.index < rowCards) {
      const result = move(
        state[source.droppableId],
        state[destination.droppableId],
        source,
        destination
      );
      setState((prev) => {
        return { ...prev, ...result };
      });
    }

    localStorage.setItem('dragUserId', result.draggableId);
    setTimeout(()=>localStorage.removeItem('dragUserId'),0);

  }

  return (
    <>
      {state && (
        <DragDropContext onDragEnd={onDragEnd}>
          {Object.keys(state).map((key, index) => (
            <Droppable
              key={index}
              droppableId={`${key}`}
              direction="horizontal"
            >
              {(provided, snapshot) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  <Stack
                    sx={{
                      flexDirection: 'row',
                      display: 'flex',
                      justifyContent: 'space-around',
                      alignItems: 'flex-start',
                      overflow: 'hidden',
                      flexWrap: 'wrap',
                      gap: '3rem',
                      py: 5,
                    }}
                  >
                    <UserDragStack users={state[key]} />
                    {provided.placeholder}
                  </Stack>
                </div>
              )}
            </Droppable>
          ))}
        </DragDropContext>
      )}
    </>
  );
};

export default UserDraggableComponent;
