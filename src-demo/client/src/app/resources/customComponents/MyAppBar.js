import * as React from 'react';
import { AppBar, UserMenu } from 'react-admin';
// import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import ToolTip from '@mui/material/Tooltip';
import AppIcon from '@material-ui/icons/LocalBar';
import ThemeButton from './themButton';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

// const MyLogoutButton = props => <Logout {...props} icon={<ExitToAppIcon/>} />;
const MyUserMenu = () => (
  <UserMenu>
    <ThemeButton />
  </UserMenu>
);

const MyAppBar = ({ classes, ...props }) => (
  <AppBar
    sx={{
      '& .RaAppBar-title': {
        flex: 2,
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
      },
    }}
    open={false}
    container={React.Fragment}
    {...props}
  >
    <Toolbar disableGutters sx={{ flexGrow: 1 }}>
      <Typography
        variant="h6"
        color="inherit"
        component="div"
        id="react-admin-title"
      >
        <AppIcon
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          style={{ marginTop: '0.2rem', marginRight: '0.4rem', color: 'red' }}
        />
      </Typography>
      <ThemeButton />
    </Toolbar>
  </AppBar>
);

export default MyAppBar;
