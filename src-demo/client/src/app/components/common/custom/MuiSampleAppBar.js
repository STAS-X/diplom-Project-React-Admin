import * as React from 'react';
import AppBar from '@mui/material/AppBar';

import { styled } from '@mui/material/styles';
import { green, blue } from '@mui/material/colors';
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

import DefaultIcon from '@material-ui/icons/ViewList';
import UserIcon from '@material-ui/icons/People';
import CommentIcon from '@material-ui/icons/Comment';
import TaskIcon from '@material-ui/icons/Pages';

import LogoIcon from '@material-ui/icons/Apple';

import ProfileIcon from '@material-ui/icons/Portrait';
import ProjectIcon from '@material-ui/icons/HelpRounded';
import RefreshIcon from '@material-ui/icons/RefreshRounded';
import LogoutIcon from '@material-ui/icons/ExitToAppRounded';

import { useRedirect, useRefresh } from 'react-admin';

import { useLogout, setSidebarVisibility } from 'react-admin';
import { useDispatch, useSelector } from 'react-redux';
import { getAppTheme, getAppTitle, setAppTitle  } from '../../../store/appcontext';
import { getAuthData, setAuthLogout } from '../../../store/authcontext';

import CustomTitle from './customTitle';

import ThemeButton from '../styled/themButton';
import ColorizedButton from '../styled/colorButton';
import LoadingButton from '../styled/loadingButton';

const pages = [
  { title: 'Главная', icon: DefaultIcon, resource: '/main' },
  { title: 'Пользователи', icon: UserIcon, resource: '/users' },
  { title: 'Задачи', icon: TaskIcon, resource: '/tasks' },
  { title: 'Комментарии', icon: CommentIcon, resource: '/comments' },
  { title: 'О проекте', icon: ProjectIcon, resource: '/project' },
];
const settings = [
  { title: 'Профиль', icon: ProfileIcon },
  { title: 'О проекте', icon: ProjectIcon, resource: '/project' },
  { title: 'Обновить', icon: RefreshIcon },
  { title: 'Выйти', icon: LogoutIcon },
];

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
  //const { getState } = useStore()
  const redirect = useRedirect();
  const theme = useSelector(getAppTheme());
  const appTitle = useSelector(getAppTitle());
  const { user: authUser } = useSelector(getAuthData());
  const isOpen = useSelector((state) => state.admin.ui.sidebarOpen);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
    // event.currentTarget.classList.toggle('unrotateMenu');
    // if (event.currentTarget.classList.contains('rotateMenu'))
    //   event.currentTarget.classList.toggle('rotateMenu');

    dispatch(setSidebarVisibility(!isOpen));
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = (pageTo, pageTitle) => {
    // anchorElNav.classList.toggle('rotateMenu');
    // if (anchorElNav.classList.contains('unrotateMenu'))
    //   anchorElNav.classList.toggle('unrotateMenu');
    setAnchorElNav(null);
    dispatch(setSidebarVisibility(!isOpen));
    if (typeof pageTo === 'string' && pageTo.indexOf('/') > -1) {
      dispatch(setAppTitle(pageTitle));
      redirect(pageTo);
    }
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const logout = useLogout();
  const handleLogout = () => {
    //dispatch(setAuthLogout());
    logout();
  };
  const refresh = useRefresh();
  const handleRefresh = () => {
    //dispatch(setAuthLogout());
    refresh();
  };

  const handleProject = () => {
    dispatch(setAppTitle('О проекте'));
    redirect('/project');
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
            <MenuIcon
              style={
                isOpen
                  ? {
                      transition: '300ms ease-out',
                      transform: 'rotate(180deg)',
                    }
                  : {
                      transition: '300ms ease-out',
                      transform: 'rotate(-180deg)',
                    }
              }
            />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              ml: 0.5,
              /*color: green[300],*/
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
            {pages.map((page, ind) => (
              <MenuItem
                key={ind}
                onClick={() => handleCloseNavMenu(page.resource, page.title)}
              >
                <Avatar sx={{ bgcolor: green[300], mr: 1 }}>
                  <page.icon />
                </Avatar>{' '}
                <Typography textAlign="center">{page.title}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ bgcolor: green[700], mr: 0.5 }}>
            <LogoIcon />
          </Avatar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: 'flex' }}
          >
            <CustomTitle />
          </Typography>
        </Box>
        {/* <Box sx={{ flexGrow: 1, display: 'none' }}>
          {pages.map((page, ind) => (
            <Button
              key={ind}
              onClick={() => handleCloseNavMenu(page.resource)}
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              {page.title}
            </Button>
          ))}
        </Box> */}

        <Box sx={{ flexGrow: 0, display: 'flex', mr: 3 }}>
          <LoadingButton />
          <ColorizedButton/>
          <ThemeButton />
          <Tooltip title={authUser ? authUser.displayName : '-XXX-'}>
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
                  /*title={`${authUser?.email ? authUser?.email : 'email empty'}`}*/
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
            {settings.map((setting, ind) => (
              <MenuItem
                key={ind}
                onClick={() => {
                  handleCloseUserMenu();
                  if (setting.title === 'О проекте') handleProject();
                  if (setting.title === 'Обновить') handleRefresh();
                  if (setting.title === 'Выйти') handleLogout();
                }}
              >
                <Avatar sx={{ bgcolor: blue[300], mr: 1 }}>
                  <setting.icon />
                </Avatar>{' '}
                <Typography textAlign="center">{setting.title}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
export default CustomAppBar;
