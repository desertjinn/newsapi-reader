import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

const styles = {
  root: {
    flexGrow: 1,
  }
};

function LinearProgressBar(props) {
  const { classes, showProgress, showProgressColor } = props;
  if (showProgress) {
    return (
        <div className={classes.root}>
          <LinearProgress color={ showProgressColor ? showProgressColor : 'primary' } />
        </div>
      );
  } else {
    return ( <hr/> );
  }
  
}

LinearProgressBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LinearProgressBar);