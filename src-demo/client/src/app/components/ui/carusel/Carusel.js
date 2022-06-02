import React from 'react';
import Carousel from 'react-material-ui-carousel';
import { ImageTwoTone as ImageHome } from '@mui/icons-material';
import { Paper, Stack, CardMedia, Button } from '@mui/material';
import { green, blueGrey, blue, cyan, pink } from '@material-ui/core/colors';

const CaruselImages = (props) => {
  const { index } = props;

  var items = Array.from(
    { length: 8 },
    (_, i) => `%PUBLIC_URL%/../images/image${i+1}.jpg`
  );

  const handleChangeSlide = (current, previous) => {
    console.log(current, previous, 'slider changed');
    const currentItem = document.getElementById(`carusel-item-${current}`);
    const previousItem = document.getElementById(`carusel-item-${previous}`);
    //itemCarusel.addEventListener(ontransitionend, ({target})=>{target.style.opacity=1}, {once:true});
    currentItem.style.opacity = 1;
    previousItem.style.opacity = 0.15;
  };

  const initProps = {
    interval: 4500,
    duration: 1500,
    index,
    animation: 'slide',
    changeOnFirstRender: true,
    cycleNavigation: true,
    navButtonsAlwaysInvisible: true,
    onChange: handleChangeSlide,
    indicatorIconButtonProps: {
      style: {
        padding: '10px', // 1
        color: blue[400], // 3
      },
    },
    activeIndicatorIconButtonProps: {
      style: {
        backgroundColor: blueGrey[100], // 2
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
    <Carousel {...initProps} height="60vh" sx={{mt:2}} IndicatorIcon={<ImageHome />}>
      {items.map((image, i) => (
        <CardMedia
          key={i}
          id={`carusel-item-${i}`}
          title={`Картинка ${i + 1}`}
          image={image}
          component='img'
          sx={{ width: '100%', height: '100%', mt:10, transition:'opacity 1.5s' }}
        />
      ))}
    </Carousel>
  );
};

export default CaruselImages;
