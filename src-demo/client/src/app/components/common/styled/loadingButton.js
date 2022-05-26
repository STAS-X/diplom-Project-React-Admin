import IconButton from '@mui/material/IconButton';
import {FindInPageOutlined as MenuIcon} from '@material-ui/icons';
import Tooltip from '@mui/material/Tooltip';
import { green, blue, red, grey } from '@material-ui/core/colors';
import { emphasize } from '@material-ui/core/styles/colorManipulator';
import { getHook } from 'react-hooks-outside/lib';
import { setAppLoading, getAppLoading } from '../../../store/appcontext';
import { useSelector } from 'react-redux';

const LoadingButton = ({ ...props }) => {
  const loading = useSelector(getAppLoading());

  const handleAnimationEnd = ({ target }) => {
    if (target.classList.contains('animate__animated')) {
      target.classList.remove(
        'animate__animated',
        'animate__headShake',
        'animate__fast'
      );
    }
  };

  const handleClickLoading = ({ target }) => {
    const dispatch = getHook('dispatch');
    const svg = target.querySelector('svg')

    svg.classList.add(
      'animate__animated',
      'animate__headShake',
      'animate__fast'
    );
    svg.addEventListener('animationend', handleAnimationEnd, {once:true});

    dispatch(setAppLoading());
  };

  return (
    <Tooltip title="Предзагрузка">
      <IconButton
        size="large"
        aria-label="loading component inside"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleClickLoading}
        sx={{ bgcolor: loading ? emphasize(blue[900],0.06) : emphasize(grey[800],0.15), mr: 0.5 }}
        color="inherit"
      >
        <MenuIcon />
      </IconButton>
    </Tooltip>
  );
};

export default LoadingButton;
