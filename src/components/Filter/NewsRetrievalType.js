import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

const styles = theme => ({
  root: {
    display: 'flex',
  },
  formControl: {
    margin: theme.spacing.unit * 3,
  },
  group: {
    margin: `${theme.spacing.unit}px 0`,
  },
});

class NewsRetrievalType extends React.Component {
  state = {
    value: 'topHeadlines',
  };

  handleChange = event => {
    this.setState({ value: event.target.value });
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">News Retrieval Type</FormLabel>
          <RadioGroup
            aria-label="News Retrieval Type"
            name="newsRetrievalType"
            className={classes.group}
            value={this.state.value}
            onChange={this.handleChange}
          >
            <FormControlLabel value="topHeadlines" control={<Radio />} label="Headlines" />
            <FormControlLabel value="everything" control={<Radio />} label="Everything" />
          </RadioGroup>
        </FormControl>
      
        <Radio
          checked={this.state.selectedValue === 'a'}
          onChange={this.handleChange}
          value="a"
          name="radio-button-demo"
          aria-label="Headlines"
          inputProps={{ 'aria-label': 'Checkbox A' } }
        /> 
        <Radio
          checked={this.state.selectedValue === 'b'}
          onChange={this.handleChange}
          value="b"
          name="radio-button-demo"
          aria-label="B"
        />
      </div>
    );
  }
}

NewsRetrievalType.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NewsRetrievalType);