import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';
import TextField from '@material-ui/core/TextField';
import SwitchesWithLabel from './SwitchWithLabel';
import isoLangs from './isolanguages';
import countrycodes from './countrycodes';

const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('5085ba8489714c3f9ebc9beb9aa16eb0');
const isoLanguages = isoLangs();
const countryCodes = countrycodes();

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: theme.spacing.unit / 4,
  },
  formAlignment: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
    maxWidth: 300,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
});
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

class Filter extends React.Component {
  state = {
    id : this.props.id,
    retrievalFunction: this.props.retrievalFunction,
    language: this.props.language,
    country: this.props.country,
    category: this.props.category,
    source: this.props.source,
    search: this.props.search,
    sources: [],
    languages: [],
    countries: [],
    categories: [],
  };

  generateLangagesList = () => {
    var languages = [];
    if (this.state.sources && this.state.sources.length) {
      languages = this.state.sources
        .filter((source) => (source && source.language && isoLanguages[source.language]))
        .map((source) => {
          var language = {};
          language.key = source.language;
          language.name = isoLanguages[source.language].name;
          language.native = isoLanguages[source.language].nativeName;
          return language;
        });
    }
    this.setState({ languages : languages });
  }

  generateCountriesList = () => {
    var countries = [];
    if (this.state.sources && this.state.sources.length) {
      countries = this.state.sources
        .filter((source) => (source && source.country && countryCodes[source.country]))
        .map((source) => {
          var country = {};
          country.key = source.country;
          country.name = countryCodes[source.country].name;
          country.code = countryCodes[source.country].code;
          country.phone = countryCodes[source.country].phone_code;
          return country;
        });
    }
    this.setState({ countries : countries });
  }

  generateCategoriesList = () => {
    var categories = [];
    if (this.state.sources && this.state.sources.length) {
      categories = this.state.sources
        .filter((source) => (source && source.category))
        .map((source) => {
          var category = {};
          category.key = source.category;
          category.name = source.category.charAt(0).toUpperCase() + source.category.slice(1);
          return category;
        });
    }
    this.setState({ categories : categories });
  }

  componentWillMount() {
    newsapi.v2.sources().then(response => {
      if ("ok" === response.status) {
        this.setState({ sources : response.sources })
        this.generateLangagesList();
        this.generateCountriesList();
        this.generateCategoriesList();
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ backgroundColor: nextProps.backgroundColor, color: nextProps.color });
  }

  handleChange = event => {
    if (event.target.value && "" !== event.target.value) {
      var filteredValue = event.target.value.filter(function (el) {
        return (el && "" !== el);
      });
      this.setState({ [event.target.name]: filteredValue }, () => {
        this.refreshNews();
      });
    }
  }

  handleTextChange = event => {
    if (event.target.value && "" !== event.target.value) {
      var filteredValue = event.target.value;
      this.setState({ [event.target.name]: filteredValue }, () => {
        this.refreshNews();
      });
    }
  }

  refreshNews() {
    if (this.props.onFilterChange) {
      this.props.onFilterChange(
        this.state.language,
        this.state.country,
        this.state.category,
        this.state.source,
        this.state.search
      );
    }
  }

  renderLanguageOptions() {
    var processedLangauges = [];
    var languageMenuItems = [];
    this.state.languages
      .forEach((lang) => {
        if (lang.key && !processedLangauges.includes(lang.key)) {
          processedLangauges.push(lang.key);
          languageMenuItems.push(
            <MenuItem key={lang.key} value={lang.key}>{lang.name} - {lang.native}</MenuItem>
          );
        }
      });
    return languageMenuItems;
  }

  renderCountryOptions() {
    var processedCountries = [];
    var countryMenuItems = [];
    this.state.countries
      .forEach((country) => {
        if (country && !processedCountries.includes(country.code.toLowerCase())) {
          processedCountries.push(country.code.toLowerCase());
          countryMenuItems.push(
            <MenuItem key={country.code.toLowerCase()} value={country.code.toLowerCase()}>
              {country.name}({country.code})
            </MenuItem>
          );
        }
      });
    return countryMenuItems;
  }

  renderCategoryOptions() {
    var processedCategories = [];
    var categoryMenuItems = [];
    this.state.categories
      .forEach((category) => {
        if (category && !processedCategories.includes(category.key)) {
          processedCategories.push(category.key);
          categoryMenuItems.push(
            <MenuItem key={category.key} value={category.key}>
              {category.name}
            </MenuItem>
          );
        }
      });
    return categoryMenuItems;
  }

  renderSourceOptions() {
    var processedSources = [];
    var sourceMenuItems = [];
    this.state.sources
      .forEach((source) => {
        if (source && !processedSources.includes(source.id)) {
          processedSources.push(source.id);
          sourceMenuItems.push(
            <MenuItem key={source.id} value={source.id}>
              {source.name}
            </MenuItem>
          );
        }
      });
    return sourceMenuItems;
  }

  renderMultiSelection(value, map) {
    return map.find(lang => lang.key === value) ? 
      map.find(lang => lang.key === value).name : "None"
  }

  renderMultiSelectionForSources(value) {
    return this.state.sources.find(source => source.id === value) ? 
      this.state.sources.find(source => source.id === value).name : "None"
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.formAlignment} id={this.state.id} >
        <form className={classes.root} autoComplete="off">
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="source">Sources</InputLabel>
            <Select
              multiple
              name="source"
              value={this.state.source}
              onChange={this.handleChange}
              input={<Input id="source" />}
              renderValue={selected => (
                <div className={classes.chips}>
                  {selected.map((value) => (
                    <Chip 
                      key={value} 
                      label={this.renderMultiSelectionForSources(value)} 
                      className={classes.chip} />
                  ))}
                </div>
              )}
              MenuProps={MenuProps}
            >
              <MenuItem value=""><em>None</em></MenuItem>
              { this.renderSourceOptions() }
            </Select>
            <FormHelperText>Any preferred sources?</FormHelperText>
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="language">Languages</InputLabel>
            <Select
              multiple
              name="language"
              value={this.state.language}
              onChange={this.handleChange}
              input={<Input id="language" />}
              renderValue={selected => (
                <div className={classes.chips}>
                  {selected.map((value) => (
                    <Chip 
                      key={value} 
                      label={this.renderMultiSelection(value, this.state.languages)} 
                      className={classes.chip} />
                  ))}
                </div>
              )}
              MenuProps={MenuProps}
            >
              { this.renderLanguageOptions() }
            </Select>
            <FormHelperText>Preferred languages</FormHelperText>
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="country">Countries</InputLabel>
            <Select
              multiple
              name="country"
              value={this.state.country}
              onChange={this.handleChange}
              input={<Input id="country" />}
              renderValue={selected => (
                <div className={classes.chips}>
                  {selected.map((value) => (
                    <Chip 
                      key={value} 
                      label={this.renderMultiSelection(value, this.state.countries)} 
                      className={classes.chip} />
                  ))}
                </div>
              )}
              MenuProps={MenuProps}
            >
              <MenuItem value=""><em>None</em></MenuItem>
              { this.renderCountryOptions() }
            </Select>
            <FormHelperText>Preferred countries</FormHelperText>
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="category">Categories</InputLabel>
            <Select
              multiple
              name="category"
              value={this.state.category}
              onChange={this.handleChange}
              input={<Input id="category" />}
              renderValue={selected => (
                <div className={classes.chips}>
                  {selected.map((value) => (
                    <Chip 
                      key={value} 
                      label={this.renderMultiSelection(value, this.state.categories)} 
                      className={classes.chip} />
                  ))}
                </div>
              )}
              MenuProps={MenuProps}
            >
              { this.renderCategoryOptions() }
            </Select>
            <FormHelperText>Preferred categories</FormHelperText>
          </FormControl>
          <FormControl className={classes.formControl}>
            <TextField
              id="search"
              name="search"
              label="Refine"
              defaultValue={this.state.search}
              onChange={this.handleTextChange}
              className={classes.textField}
              helperText="Refine article search"
              margin="normal"
            />
          </FormControl>
          <FormControl className={classes.formControl}>
            <SwitchesWithLabel 
              options={[
                { 
                  on: true, 
                  label: "Headlines", 
                  onSwitchOn: this.props.onSwitchToHeadlines, 
                  onSwitchOff: this.props.onSwitchToEverything    
                },
                { 
                  on: false, 
                  label: "Dark", 
                  onSwitchOn: this.props.onSwitchToDarkMode, 
                  onSwitchOff:this.props.onSwitchToLightMode  
                }
              ]} />
          </FormControl>
        </form>
      </div>
    );
  }
}

Filter.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Filter);