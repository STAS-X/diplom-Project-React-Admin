import * as React from 'react';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { styled, createTheme, Box, Typography, Button, useTheme } from '@mui/material';
import {
  AppBar,
  Menu,
  Sidebar,
  ComponentPropType,
  ToggleThemeButton,
  defaultTheme,
} from 'react-admin';

const Root = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  zIndex: 1,
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
  position: 'relative',
}));

const AppFrame = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  overflowX: 'auto',
}));

const ContentWithSidebar = styled('main')(({ theme }) => ({
  display: 'flex',
  flexGrow: 1,
}));

const Content = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 2,
  padding: theme.spacing(3),
  marginTop: '4em',
  paddingLeft: 5,
}));

const darkTheme = createTheme({
  palette: { mode: 'dark' },
});

const MyLayout = ({ children, dashboard, title }) => {
  const [theme] = useTheme();

  return (
        <Button onClick={() => setTheme(theme.palette.mode === 'dark' ? lightTheme : darkTheme)}>
            {theme.palette.mode === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
        </Button>
    );
};

MyLayout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  dashboard: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  title: PropTypes.string.isRequired,
};

export default MyLayout;
