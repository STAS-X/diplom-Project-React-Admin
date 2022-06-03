import React from 'react';
import {
  CreateButton,
  useRedirect
} from 'react-admin';
import {
  Card, CardContent, Grid, CardMedia, Typography
} from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';
import AddCommentIcon from '@material-ui/icons/AddCommentRounded';

const useStyles = makeStyles({
    root: {
      width: 'max-content',
      height: 'max-content',
      zIndex: 1,
      padding:'10px',
      margin:'auto'
    },
    media: {
      justifyContent: 'center',
      maxWidth: '80%',
      maxHeight: '80%',
      marginTop: '-1rem',
      marginBottom: '1rem',
      objectFit: 'cover',
    },
  });


const ComponentEmptyPage = ({path, isAuth, resourceId, title}) => {
    const classes=useStyles();
    const redirect = useRedirect();

    return (
      <Card variant="outlined" className={classes.root}>
      <CardContent>
        <Grid
          container
          direction="column"
          justifyContent="flex-start"
          alignItems="center"
          spacing={5}
        >
        <Typography
          gutterBottom
          color="primary"
          variant="h6"
          component="h2"
          sx={{
            textAlign: 'center',
            zIndex:2,
            mt: 5,
          }}
        >
          {title}
        </Typography>
            <CardMedia
                className={classes.media}
                image={'/%PUBLIC_URL%/../images/page-empty.jpg'}
                component="img"
                >
            </CardMedia>
            {(!isAuth || isAuth===true) && (
            <CreateButton
                label="Создать"
                variant="contained"
                color="primary"
                onClick={()=> {
                    console.log(resourceId, 'get resourceId');
                                if (resourceId) {
                                    if (path === "comments") localStorage.setItem('currentTaskId',resourceId);
                                }
                                redirect(`/${path}/create`);
                              }}
                icon={<AddCommentIcon />}
            />)}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ComponentEmptyPage;