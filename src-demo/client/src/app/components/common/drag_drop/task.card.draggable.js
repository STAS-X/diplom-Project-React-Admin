import React, { useState } from 'react';
import TaskCard from '../cards/task.card.list';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Stack } from '@mui/material';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (
  source,
  destination,
  droppableSource,
  droppableDestination,
  rowCards
) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  let visaVersa = [];
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
            <TaskCard record={data} isDragging={snapshot.isDragging} />
          </div>
        );
      }}
    </Draggable>
  );
}

const TaskDragStack = React.memo(function TaskDragStack({ tasks }) {
  return tasks.map((task, index) => (
    <TaskDragCard data={task} index={index} key={task.id} />
  ));
});

const TaskDraggableComponent = ({ list: tasks, ids }) => {
  const [state, setState] = useState(null);
  const [rowCards, setRowCards] = useState(
    document.getElementById('main-content')
      ? Math.floor(document.getElementById('main-content').clientWidth / 400)
      : 4
  );
  const tasksByRows = {};

  React.useEffect(() => {
    //if (!state) {
    for (let num = 0; num + 1 <= Math.ceil(tasks.length / rowCards); num++) {
      tasksByRows[`draglist${num + 1}`] = tasks.slice(
        num * rowCards,
        (num + 1) * rowCards
      );
    }
    setState(tasksByRows);
    //}
    return () => {};
  }, [ids]);

  React.useEffect(() => {
    setRowCards((prev) =>
      document.getElementById('main-content')
        ? Math.floor(document.getElementById('main-content').clientWidth / 400)
        : prev
    );

    return () => {};
  }, []);

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

      setState((prev) => {
        return { ...prev, [source.droppableId]: items };
      });
    } else if (destination.index < rowCards) {
      const result = move(
        state[source.droppableId],
        state[destination.droppableId],
        source,
        destination,
        rowCards
      );
      setState((prev) => {
        return { ...prev, ...result };
      });
    }

    localStorage.setItem('dragTaskId', result.draggableId);
    setTimeout(() => localStorage.removeItem('dragTaskId'), 0);
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
                    <TaskDragStack tasks={state[key]} />
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

export default TaskDraggableComponent;
