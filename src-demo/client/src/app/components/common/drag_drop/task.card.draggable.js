import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import styled from "styled-components";
import TaskCard from '../cards/task.card.list';
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

function TaskDragCard({ data, index }) {
  return (
    <Draggable draggableId={data.id} index={index}>
      {(provided, snapshot) => {
        return (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}

        >
          <TaskCard record={data} isDragging={snapshot.isDragging}/>
        </div>)
        }}
    </Draggable>
  );
}

const TaskDragStack  = React.memo(function TaskDragStack({ tasks }) {

  return tasks.map((task, index) => (
    <TaskDragCard data={task} index={index} key={task.id} />
  ));
});

const TaskDraggableComponent = ({ list: tasks, ids }) => {

  const [state, setState] = useState(null);
  const tasksByRows = {}

   React.useEffect(()=>{
  //if (!state) {
    for (let num=0; num*rowCards<=tasks.length; num++ ) {
      tasksByRows[`draglist${num+1}`]=tasks.slice(num*rowCards, (num+1)*rowCards)
    }
    setState(tasksByRows);
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
    } else  {
       const result = move(
        state[source.droppableId],
        state[destination.droppableId],
        source,
        destination
      );
      setState(prev => {return {...prev, ...result}});
    }

    localStorage.setItem('dragTaskId', result.draggableId);
    setTimeout(()=>localStorage.removeItem('dragTaskId'),0);

  }

  return (
    <>
  {state &&  (
  <DragDropContext onDragEnd={onDragEnd}>
    {Object.keys(state).map((key, index) => (
      <Droppable key={index} droppableId={`${key}`} direction="horizontal">
        {(provided, snapshot) => (
          <div 
            {...provided.droppableProps}
            ref={provided.innerRef}>

            <Stack
              sx={{
                flexDirection:'row',
                display:'flex',
                justifyContent: 'space-around',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: '3rem',
                py: 5,
              }}
            >
            <TaskDragStack tasks={state[key]} />
            {provided.placeholder}
            </Stack>
            </div>
          )}
      </Droppable>
    ))}
    </DragDropContext>)}
    </>
  );
};

export default TaskDraggableComponent;
