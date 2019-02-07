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
    searchQuery: null
  }
  constructor(props) {
    super(props);
    this.onSwitchToDarkMode = this.onSwitchToDarkMode.bind(this);
    this.onSwitchToLightMode = this.onSwitchToLightMode.bind(this);
    this.onSwitchToHeadlines = this.onSwitchToHeadlines.bind(this);
    this.onSwitchToEverything = this.onSwitchToEverything.bind(this);
    this.updateDimensions = this.updateDimensions.bind(this);
    this.retrieveNewsApiData = this.retrieveNewsApiData.bind(this);
    this.generateNewsCards = this.generateNewsCards.bind(this);
    this.isEmpty = this.isEmpty.bind(this);
    this.generateNewsFilter = this.generateFilter.bind(this);
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions);
    this.retrieveNewsApiData();  
    this.updateDimensions();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  retrieveNewsApiData() {
    newsapi.v2[this.state.retrievalFunction]({ 
      'q': this.state.searchQuery ? this.state.searchQuery : 'today',
      'sources' : '', // comma seperated list
      'language' : '', // comma seperated list??
      'domains' : '', // comma seperated list
      'excludeDomains' : '', // comma seperated list
      'from' : '', // e.g. 2019-02-07 or 2019-02-07T09:42:40
      'to' : '', // e.g. 2019-02-07 or 2019-02-07T09:42:40
      'sortBy' : '', // Possible options: relevancy, popularity, publishedAt.
      'pageSize' : '20', // 20 is the default, 100 is the maximum.
      'page' : '1' // Use this to page through the results.
    }).then(response => {
      this.props.enqueueSnackbar('Fetched articles from News API.', { 
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
      this.props.enqueueSnackbar('Failed to fetch articles from News API.', { 
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
    document.body.className = this.props.classes.whiteOnBlack;
    this.setState({ FilterTheme: "whiteOnBlack" });
    this.props.enqueueSnackbar('Setting dark theme...', { 
      variant: 'default',
      autoHideDuration: 5000
    });
  }

  onSwitchToLightMode() {
    document.body.className = this.props.classes.blackOnWhite;
    this.setState({ FilterTheme: "blackOnWhite" });
    this.props.enqueueSnackbar('Setting light theme...', { 
      variant: 'default',
      autoHideDuration: 5000
    });
  }

  onSwitchToHeadlines() {
    this.setState({ retrievalFunction: "topHeadlines" });
    this.retrieveNewsApiData();  
    this.props.enqueueSnackbar('Setting news type as -"Headlines"', { 
      variant: 'default',
      autoHideDuration: 5000
    });
  }

  onSwitchToEverything() {
    this.setState({ retrievalFunction: "everything" });
    this.retrieveNewsApiData();  
    this.props.enqueueSnackbar('Setting news type as -"Everything"', { 
      variant: 'default',
      autoHideDuration: 5000
    });
  }

  onChangeOfFilter(language, country, category, source) {
    console.log("FILTER CHANGED!  ===>> ");
    console.log(language, country, category, source);
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
