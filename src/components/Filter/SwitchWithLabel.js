import React from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

class SwitchWithLabel extends React.Component {
  state = {
    switchOn: false,
    switchLabel: this.props.label
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.checked });
    if (event.target.checked) {
      this.props.onSwitchOn();
    } else {
      this.props.onSwitchOff();
    }
  }

  render() {
    return (
      <FormGroup row>
        <FormControlLabel
          control={
            <Switch
              checked={this.state.switchOn}
              onChange={this.handleChange('switchOn')}
              value={this.state.switchLabel}
            />
          }
          label={this.state.switchLabel}
        />
      </FormGroup>
    );
  }
}

export default SwitchWithLabel;