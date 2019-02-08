import React from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

class SwitchesWithLabel extends React.Component {
  state = {
    options: this.props.options
  };

  constructor(props) {
    super(props);
    this.generateOptions = this.generateOptions.bind(this);
  }

  handleChange = label => event => {
    this.state.options.map(option => {
      if (option.label === label) {
        option.on = event.target.checked;
        if (event.target.checked) {
          option.onSwitchOn();
        } else {
          option.onSwitchOff();
        }
      }
      return option;
    });
  }

  generateOptions() {
    return this.state.options.map((option, key) => {
      return <FormControlLabel 
        key={'option_' + key} 
        control={
          <Switch
            checked={option.on}
            onChange={this.handleChange(option.label)}
            value={option.label}
          />
        }
        label={option.label}
      />;
    });
    
  }

  render() {
    return (
      <FormGroup row>{ this.generateOptions() }</FormGroup>
    );
  }
}

export default SwitchesWithLabel;