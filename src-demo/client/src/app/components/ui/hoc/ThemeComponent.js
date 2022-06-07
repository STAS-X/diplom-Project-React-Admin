import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  root: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 24,
    padding: '0 30px',
  },
};

function HigherOrderComponent({children, classes}) {
  const arrayChildren = React.Children.toArray(children.props.children);
  const newChildren = React.Children.map(arrayChildren, (child) => {
    return child;
  });

  return newChildren;
};

HigherOrderComponent.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(HigherOrderComponent)

