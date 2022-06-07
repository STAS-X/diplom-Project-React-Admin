import * as React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  CircularProgress,
  LinearProgress,
} from '@mui/material';
import { green, blue, red } from '@mui/material/colors';

function CircularProgressWithLabel(props) {
    const {value} = props;
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress
        variant="determinate"
        value={value}
        color={value < 30 ? 'error' : value < 70 ? 'secondary' : 'success'}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="caption" component="div" color="text.secondary">
          {`${value}%`}
        </Typography>
      </Box>
    </Box>
  );
}

const CircularDynamic = (props) => {
  const [progress, setProgress] = React.useState(10);
  const { value } = props;

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress >= value
          ? 0
          : prevProgress + 10 < value
          ? prevProgress + 10
          : value
      );
    }, 800);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return <CircularProgressWithLabel value={progress} />;
};

const CircularDeterminate = (props) => {
    const { value } = props;
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress
        variant="determinate"
        value={value}
        color={value < 30 ? 'error' : value < 70 ? 'secondary' : 'success'}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="caption" component="div" color="text.secondary">
          {`${value}%`}
        </Typography>
      </Box>
    </Box>
  );
};

const LinearDeterminate = (props) => {
    const { value } = props;
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" value={value} />
      </Box>
      <Box sx={{ minWidth: 10 }}>
        <Typography
          variant="body2"
          color="text.secondary"
        >{`${value}%`}</Typography>
      </Box>
    </Box>
  );
};

const TaskProgressBar = ({id, value}) => {
  switch (id) {
    case 1:
      return <CircularDeterminate value={value>100?100:value}  />;
    case 2:
      return <LinearDeterminate value={value>100?100:value} />;
    default:
      return <CircularDynamic value={value>100?100:value} />;
  }
};

CircularProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate variant.
   * Value between 0 and 100.
   * @default 0
   */
  value: PropTypes.number.isRequired,
};

TaskProgressBar.propTypes = {
  id: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

export default TaskProgressBar;
