import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { green, blue, red } from '@material-ui/core/colors';
import { emphasize } from '@material-ui/core/styles/colorManipulator';
import {Card, CardMedia, Divider, Grid, Box, CardContent, Typography, CircularProgress} from '@material-ui/core';
import {Stack} from '@mui/material';
import { getAuthData } from '../../../store/authcontext';
import { getAppColorized } from '../../../store/appcontext';
import { dateFormatter } from '../../../utils/displayDate';
import { EmailField, SimpleShowLayout, TextField, Labeled, DateField, useDelete } from 'react-admin';

const useStyles = (isCurrentUser, isColorized) =>
  makeStyles({
    root: {
      width: '350px',
      height: '380px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
      '&:hover': {
        boxShadow: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px',
      },
      backgroundColor: isColorized?emphasize(
        isCurrentUser ? green[100] : red[100],
        0.05
      ):'whitesmoke',
      transition: '300ms ease-out',
    },
    media: {
      justifyContent: 'center',
      width: '200px',
      height: '150px',
      marginTop: '1rem',
      objectFit: 'unset',
      margin: 'auto',
    },
  });

const UserCard = (props) => {
  const user = props.record;

  const animation = '_pulse';

  const { user: authUser } = useSelector(getAuthData());
  const colorized = useSelector(getAppColorized());
  //const classes = useCallback((num) => , [taskCompleted]);
  const classes = useStyles(authUser.uid === user.uid,colorized)();
  const cardRef = useRef();

  useEffect(() => {
 
    if (cardRef.current) {
      const cardAnimate = cardRef.current;

      const handleAnimationEnd = (e) => {
        e.stopPropagation();
        e.target.classList.remove(
          'animate__animated',
          `animate_${animation}`,
          'animate__fast'
        );
      };
      const handleMouseEnter = ({ target }) => {
        target.classList.add(
          'animate__animated',
          `animate_${animation}`,
          'animate__fast'
        );
      };

      cardAnimate.addEventListener('animationend', handleAnimationEnd);
      cardAnimate.addEventListener('mouseenter', handleMouseEnter);
    }

    return () => {};
  }, [cardRef.current]);

  return (
    <Card variant="outlined" ref={cardRef} className={classes.root}>
      <CardMedia
        className={classes.media}
        image={user.url}
        component="img"
        title="Avatar"
      >
      </CardMedia>
      <CardContent>
          <Typography
            gutterBottom
            color="primary"
            variant="h6"
            component="h2"
            style={{textAlign:'center', padding:0, margin:0, marginBottom:-10, marginLeft:10}}
          >
            {user.name}
          </Typography>
          <Grid container
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
                columns={12}
                spacing={6}>

            <Grid item xs={4} style={{marginLeft:-15}} >
              <SimpleShowLayout record={user} >
                  <EmailField label="Логин" source="email" color="primary"/>
                  <TextField label="Возраст" source="age" color="primary"/>
              </SimpleShowLayout>
            </Grid>
            <Grid item xs={8} style={{marginRight:-35}}>
              <SimpleShowLayout record={user} >
                  <TextField label="Авторизация" source="providerId" color="primary"/>
                  <DateField label="Дата входа" source="lastLogOut" locales="ru-Ru"
                            showTime={true} options={{ dateStyle: 'long', timeStyle: 'medium' }} color="primary"/>
              </SimpleShowLayout>
            </Grid>
          </Grid>            
      </CardContent>
    </Card>
  );
};
export default UserCard;
