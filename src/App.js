import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import './App.css';
import { withSnackbar } from 'notistack';
import { Scrollbars } from 'react-custom-scrollbars';
import News from './components/News/News';
import Filter from './components/Filter/Filter';
import LinearProgressBar from './components/Progress/LinearProgress';
import Masonry from 'react-masonry-component';


const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('5085ba8489714c3f9ebc9beb9aa16eb0');

const masonryOptions = {
  resize: true,
  transitionDuration: 0
};
const imagesLoadedOptions = { background: '.my-bg-image-el' }

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    height: 100
  },
  blackOnWhite: {
    backgroundColor: 'white', 
    color: 'rgba(0, 0, 0, 0.54)' 
  },
  whiteOnBlack: {
    backgroundColor: 'rgba(0, 0, 0, 0.54)', 
    color: 'white' 
  }
});

class App extends Component {
  state = {
    retrievalFunction: 'topHeadlines',
    showProgress: true,
    total: 0,
    articles: [],
    width: 0,
    height: 0,
    totalHeight: 0,
    filterHeight: 0,
    contentHeight: 0,
    searchQuery: "Today",
    source: [],
    language: [],
    country: [],
    category: []

  }
  constructor(props) {
    super(props);
    this.onSwitchToDarkMode = this.onSwitchToDarkMode.bind(this);
    this.onSwitchToLightMode = this.onSwitchToLightMode.bind(this);
    this.onSwitchToHeadlines = this.onSwitchToHeadlines.bind(this);
    this.onSwitchToEverything = this.onSwitchToEverything.bind(this);
    this.onChangeOfFilter = this.onChangeOfFilter.bind(this);
    this.updateDimensions = this.updateDimensions.bind(this);
    this.retrieveNewsApiData = this.retrieveNewsApiData.bind(this);
    this.generateNewsCards = this.generateNewsCards.bind(this);
    this.isEmpty = this.isEmpty.bind(this);
    this.generateNewsFilter = this.generateFilter.bind(this);
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions);
    this.retrieveNewsApiData('Headlines');  
    this.updateDimensions();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  retrieveNewsApiData(type) {
    if (type) {
      this.props.enqueueSnackbar(`Setting article retrieval to - "${type}"`, { 
        variant: 'default',
        autoHideDuration: 5000
      });
    }
    
    newsapi.v2[this.state.retrievalFunction]({ 
      'q': this.state.searchQuery ? `${this.state.searchQuery}` : 'today',
      'sources' : this.state.source && this.state.source.length ? `${this.state.source}` : '', // comma seperated list
      'language' : this.state.language && this.state.language.length ? `${this.state.language}` : '', // comma seperated list??
      'country' : this.state.country && this.state.country.length ? `${this.state.country}` : '', // comma seperated list??
      'category' : this.state.category && this.state.category.length ? `${this.state.category}` : '', // comma seperated list??
      'domains' : '', // comma seperated list
      'excludeDomains' : '', // comma seperated list
      'from' : '', // e.g. 2019-02-07 or 2019-02-07T09:42:40
      'to' : '', // e.g. 2019-02-07 or 2019-02-07T09:42:40
      'sortBy' : '', // Possible options: relevancy, popularity, publishedAt.
      'pageSize' : '20', // 20 is the default, 100 is the maximum.
      'page' : '1' // Use this to page through the results.
    }).then(response => {
      this.props.enqueueSnackbar(`Refreshing articles...`, { 
        variant: 'success',
        autoHideDuration: 3000,
        // anchorOrigin: {
        //   vertical: 'top',
        //   horizontal: 'left',
        // },
      });
      if (response && "ok" === response.status) {
        this.setState({ 
          articles: response.articles, 
          total: response.totalResults,
          showProgress: false
        });
      }
    }).catch(error => { 
      this.props.enqueueSnackbar(`Failed to refresh articles !`, { 
        variant: 'error',
        autoHideDuration: 3000
      });
    });
  }

  updateDimensions() {
    var w = window,
      d = document,
      documentElement = document.documentElement,
      body = d.getElementsByTagName('body')[0],
      // width = w.innerWidth || documentElement.clientWidth || body.clientWidth,
      filter = d.getElementById('newsapi-filter');
    if (body && filter) {
      var totalHeight = w.innerHeight|| documentElement.clientHeight|| body.clientHeight,
      filterHeight = filter.style.height,
      contentHeight = totalHeight - filterHeight;
      this.setState({ 
        totalHeight: totalHeight,
        filterHeight: filterHeight,
        contentHeight: contentHeight,
      });
    }
  }

  onSwitchToDarkMode() {
    this.props.enqueueSnackbar('Setting theme: Dark', { 
      variant: 'info',
      autoHideDuration: 5000
    });
    document.body.className = this.props.classes.whiteOnBlack;
    this.setState({ FilterTheme: "whiteOnBlack" });
  }

  onSwitchToLightMode() {
    this.props.enqueueSnackbar('Setting theme: Light', { 
      variant: 'info',
      autoHideDuration: 5000
    });
    document.body.className = this.props.classes.blackOnWhite;
    this.setState({ FilterTheme: "blackOnWhite" });
    
  }

  onSwitchToHeadlines() {
    this.setState({ retrievalFunction: 'topHeadlines' }, () => {
      this.retrieveNewsApiData('Headlines');  
    });
  }

  onSwitchToEverything() {
    this.setState({ retrievalFunction: 'everything' }, () => {
      this.retrieveNewsApiData('Everything');  
    });
  }

  onChangeOfFilter(language, country, category, source, search) {
    this.setState({ 
      language: language,
      country: country,
      category: category,
      source: source,
      searchQuery: search
    }, () => {
      this.retrieveNewsApiData();  
    });
  }

  isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
  }

  generateFilter() {
    return <Filter 
        id={'newsapi-filter'}
        retrievalFunction={this.state.retrievalFunction}
        language={[""]} 
        country={[""]} 
        category={[""]} 
        source={[""]} 
        search={this.state.searchQuery}
        onSwitchToDarkMode={this.onSwitchToDarkMode} 
        onSwitchToLightMode={this.onSwitchToLightMode}
        onSwitchToHeadlines={this.onSwitchToHeadlines} 
        onSwitchToEverything={this.onSwitchToEverything}
        onFilterChange={this.onChangeOfFilter} 
      />;
  }

  generateNewsCards() {
    return this.state.articles.map((article, key) => { 
      return <News  
        key={key}
        index={key}
        className={'newsapi-gallery-item'}
        title={article.title} 
        date={article.publishedAt} 
        source={article.source.name}
        url={article.url}
        image={article.urlToImage ? article.urlToImage : 'images/no-image.png'}
        author={article.author} 
        content={article.content} 
        description={article.description}
      />; 
    });
  }

  generateMasonaryLayout(cards) {
    return <Scrollbars
      style={{ height: this.state.contentHeight }}>
      <Masonry
        id={'newsapi-gallery'}
        className={'newsapi-gallery'} // default ''
        elementType={'ul'} // default 'div'
        columnwidth={50}
        options={masonryOptions} // default {}
        disableImagesLoaded={false} // default false
        updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
        imagesLoadedOptions={imagesLoadedOptions} // default {}
      >{ cards }</Masonry>
    </Scrollbars>;
  }

  generateContent() {
    var content, cards = this.generateNewsCards();
    if (this.isEmpty(cards)) {
      content = <h3>Nothing to show</h3>;
    } else {
      content = this.generateMasonaryLayout(cards);
    }
    return content;
  }

  render() {
    return (
      <React.Fragment>
        { this.generateFilter() }
        <LinearProgressBar showProgress={this.state.showProgress} />
        { this.generateContent() }
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(withSnackbar(App));
