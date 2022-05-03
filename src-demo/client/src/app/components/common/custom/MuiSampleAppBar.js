import * as React from 'react';
import AppBar from '@mui/material/AppBar';

import { styled } from '@mui/material/styles';
import { green, pink } from '@mui/material/colors';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MailIcon from '@material-ui/icons/Mail';
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import Menu from '@mui/material/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';

import { useLogout, setSidebarVisibility } from 'react-admin';
import { useDispatch, useSelector } from 'react-redux';
import { getAppTheme, getAppTitle } from '../../../store/appcontext';
import { getAuthData, setAuthLogout } from '../../../store/authcontext';

import ThemeButton from '../styled/themButton';

const pages = ['Products', 'Pricing', 'Blog'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::before': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(0.5)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2)',
      opacity: 0,
    },
  },
}));

const CustomAppBar = (props) => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const dispatch = useDispatch();
  const theme = useSelector(getAppTheme());
  const appTitle = useSelector(getAppTitle());
  const { user: authUser } = useSelector(getAuthData());

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
    event.currentTarget.classList.toggle('unrotateMenu');
    if (event.currentTarget.classList.contains('rotateMenu'))
      event.currentTarget.classList.toggle('rotateMenu');

    dispatch(setSidebarVisibility(false));
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    anchorElNav.classList.toggle('rotateMenu');
    if (anchorElNav.classList.contains('unrotateMenu'))
      anchorElNav.classList.toggle('unrotateMenu');

    setAnchorElNav(null);
    dispatch(setSidebarVisibility(true));
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const logout = useLogout();
  const handleLogout = () => {
    dispatch(setAuthLogout());
    logout();
  }

  return (
    <AppBar
      position="static"
      sx={{
        m: 0,
        backgroundColor: theme === 'light' ? '#0f80f0' : '#0f4080',
      }}
    >
      <Toolbar disableGutters>
        <Box sx={{ flexGrow: 1, ml: 1, display: 'flex', alignItems: 'center' }}>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleOpenNavMenu}
            color="inherit"
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              ml: 0.5,
              color: green[300],
              minWidth: '200px',
              display: 'flex',
            }}
          >
            {appTitle}
          </Typography>
          <Menu
            id="menu-appbar"
            anchorEl={anchorElNav}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            sx={{
              display: { xs: 'block', md: 'block' },
            }}
          >
            {pages.map((page) => (
              <MenuItem key={page} onClick={handleCloseNavMenu}>
                <Typography textAlign="center">{page}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ bgcolor: green[500], mr: 0.5 }}>
            <MailIcon />
          </Avatar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: 'flex' }}
          >
            LOGO
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1, display: 'none' }}>
          {pages.map((page) => (
            <Button
              key={page}
              onClick={handleCloseNavMenu}
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              {page}
            </Button>
          ))}
        </Box>

        <Box sx={{ flexGrow: 0, display: 'flex', mr: 3 }}>
          <ThemeButton />
          <Tooltip
            title={
              authUser?.displayName ? authUser?.displayName : 'Login settings'
            }
          >
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <StyledBadge
                overlap="circular"
                anchorOrigin={
                  authUser?.providerId === 'password'
                    ? { vertical: 'top', horizontal: 'right' }
                    : { vertical: 'bottom', horizontal: 'right' }
                }
                variant="dot"
              >
                <Avatar
                  alt="Remy Sharp"
                  title={`${authUser?.email ? authUser?.email : 'email empty'}`}
                  sx={{ width: 48, height: 48 }}
                  src={
                    authUser?.photoURL ? authUser.photoURL : '/broken-image.jpg'
                  }
                >
                  TR
                </Avatar>
              </StyledBadge>
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: '45px' }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            {settings.map((setting) => (
              <MenuItem
                key={setting}
                onClick={() => {
                  handleCloseUserMenu();
                  if (setting === 'Logout') handleLogout();
                }}
              >
                <Avatar sx={{ bgcolor: pink[400], mr: 1 }}>
                  <MailIcon />
                </Avatar>{' '}
                <Typography textAlign="center">{setting}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
export default CustomAppBar;
