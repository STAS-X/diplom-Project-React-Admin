import React from 'react';
import Carousel from 'react-material-ui-carousel';
import { ImageTwoTone as ImageHome } from '@mui/icons-material';
import { Paper, Stack, CardMedia, Button } from '@mui/material';
import { green, blueGrey, blue, cyan, pink } from '@material-ui/core/colors';

const CaruselImages = (props) => {
  const { index } = props;

  var images = Array.from(
    { length: 8 },
    (_, i) => `%PUBLIC_URL%/../images/image${i + 1}.jpg`
  );

  const handleChangeSlide = (current, previous) => {

    images.forEach((_, index) => {
      const currentImage = document.getElementById(`carusel-item-${index}`);
      if (index === current) {
        setTimeout(() => {
          currentImage.style.opacity = 1;
        }, 100);
      } else {
        setTimeout(() => {
          currentImage.style.opacity = 0.15;
        }, 100);
      }
    });
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
    <Carousel
      {...initProps}
      height="80vh"
      sx={{ mt: 2 }}
      IndicatorIcon={<ImageHome />}
    >
      {images.map((image, i) => (
        <CardMedia
          key={i}
          id={`carusel-item-${i}`}
          title={`Картинка ${i + 1}`}
          image={image}
          component="img"
          sx={{
            width: '100%',
            height: '100%',
            mt: 10,
            transition: 'opacity 3s !important',
          }}
        />
      ))}
    </Carousel>
  );
};

export default CaruselImages;
