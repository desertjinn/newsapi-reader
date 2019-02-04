import React from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

class SwitchWithLabel extends React.Component {
  state = {
    dark: false
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.checked });
    if (event.target.checked) {
      this.props.onSwitchToDarkMode();
    } else {
      this.props.onSwitchToLightMode();
    }
  }

  render() {
    return (
      <FormGroup row>
        <FormControlLabel
          control={
            <Switch
              checked={this.state.checkedA}
              onChange={this.handleChange('dark')}
              value="dark"
            />
          }
          label="Dark"
        />
      </FormGroup>
    );
  }
}

export default SwitchWithLabel;