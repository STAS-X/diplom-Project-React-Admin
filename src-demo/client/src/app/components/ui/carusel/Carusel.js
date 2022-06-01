import React from 'react';
import Carousel from 'react-material-ui-carousel';
import {Home} from '@mui/icons-material';
import { Paper, Stack, Button } from '@mui/material';

const CaruselTest = (props) => {
  var items = [
    {
      name: 'Random Name #1',
      description: 'Probably the most random thing you have ever seen!',
    },
    {
      name: 'Random Name #2',
      description: 'Hello World!',
    },
  ];

  const handleChangeSlide = (current, previous) => {
      console.log(current, previous, 'slider changed');
      const currentItem=document.getElementById(`carusel-item-${current}`);
      const previousItem=document.getElementById(`carusel-item-${previous}`);
        //itemCarusel.addEventListener(ontransitionend, ({target})=>{target.style.opacity=1}, {once:true});
      currentItem.style.opacity=1;
      previousItem.style.opacity=0.15;      
  }

  const initProps = {
    interval: 5000,
    duration: 2000,
    animation: 'slide',
    changeOnFirstRender:true, 
    cycleNavigation: true,
    navButtonsAlwaysInvisible: true,
    onChange:handleChangeSlide,
    indicatorIconButtonProps: {
      style: {
        padding: '10px', // 1
        color: 'blue', // 3
      },
    },
    activeIndicatorIconButtonProps: {
      style: {
        backgroundColor: 'red', // 2
      },
    },
    indicatorContainerProps: {
      style: {
        position: 'absolute',
        top: '0',
        margin: '10px', // 5
        textAlign: 'center', // 4
      },
    },
  };

  return (
    <Carousel {...initProps} height="100vh" IndicatorIcon={<Home/>}>

      {items.map((item, i) => (
        <Item key={i} item={item} id={i}/>
      ))}

    </Carousel>
  );
};

function Item(props) {
  return (
    <Paper id={`carusel-item-${props.id}`} sx={{position: 'absolute', left: 10,  right: 10,  top: 80,  bottom: 10,   overflow: 'auto', transition:'opacity  2s'}}>
     <div style={{position:'absolute', textAlign:'center', bottom:'calc(10%-30px)'}}>
      <h3>{props.item.name}</h3>
      <p>{props.item.description}</p>
        <figure>
            <img src="https://i.pravatar.cc/300" alt="Elephant at sunset"/>
            <figcaption style={{textAlign:'center', margin:0, marginTop:-30}}>An elephant at sunset</figcaption>
        </figure>
      <Button className="CheckButton">Check it out!</Button>
     </div>
    </Paper>
  );
}

export default CaruselTest;
