import IconButton from '@mui/material/IconButton';
import MenuIcon from '@material-ui/icons/ColorizeRounded';
import Tooltip from '@mui/material/Tooltip';
import { green, red } from '@material-ui/core/colors';
import { getHook } from 'react-hooks-outside/lib';
import { setAppColorized, getAppColorized } from '../../../store/appcontext';
import { useSelector } from 'react-redux';

const ColorizedButton = ({ ...props }) => {
  const colorized = useSelector(getAppColorized());

  const handleAnimationEnd = ({ target }) => {
    if (target.classList.contains('animate__animated')) {
      target.classList.remove(
        'animate__animated',
        'animate__headShake',
        'animate__fast'
      );
    }
  };
  
  const handleClickColorized = ({ target }) => {
    const dispatch = getHook('dispatch');
    const svg = target.querySelector('svg');

    svg.classList.add(
      'animate__animated',
      'animate__headShake',
      'animate__fast'
    );
    svg.addEventListener('animationend', handleAnimationEnd, { once: true });
    dispatch(setAppColorized());
  };

  return (
    <Tooltip title="Оцветить ресурсы">
      <IconButton
        size="large"
        aria-label="colorized resource list table"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleClickColorized}
        sx={{ bgcolor: colorized ? green[500] : red[500], mx: 0.5 }}
        color="inherit"
      >
        <MenuIcon />
      </IconButton>
    </Tooltip>
  );
};

export default ColorizedButton;
