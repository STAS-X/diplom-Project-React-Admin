import IconButton from '@mui/material/IconButton';
import {PeopleAltRounded as MenuIcon} from '@material-ui/icons';
import Tooltip from '@mui/material/Tooltip';
import { blue, red, grey } from '@material-ui/core/colors';
import { emphasize } from '@material-ui/core/styles/colorManipulator';
import { getHook } from 'react-hooks-outside/lib';
import { setAppCarding, getAppCarding } from '../../../store/appcontext';
import { useSelector } from 'react-redux';

const ReviewButton = ({ ...props }) => {
  const review = useSelector(getAppCarding());

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

    dispatch(setAppCarding());
  };

  return (
    <Tooltip title="Показать карточки">
      <IconButton
        size="large"
        aria-label="card view component inside"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleClickLoading}
        sx={{ bgcolor: !review ? emphasize(blue[900],0.06) : emphasize(red[800],0.15), mr: 0.5 }}
        color="inherit"
      >
        <MenuIcon />
      </IconButton>
    </Tooltip>
  );
};

export default ReviewButton;
