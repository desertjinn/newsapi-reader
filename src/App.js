import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import './App.css';
import News from './components/News/News';
import Filter from './components/Filter/Filter';
import Masonry from 'react-masonry-component';


const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('5085ba8489714c3f9ebc9beb9aa16eb0');

const masonryOptions = {
  transitionDuration: 0
};
const imagesLoadedOptions = { background: '.my-bg-image-el' }

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
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
    total: 0,
    articles: []
  }
  constructor(props) {
    super(props);
    this.onSwitchToDarkMode = this.onSwitchToDarkMode.bind(this);
    this.onSwitchToLightMode = this.onSwitchToLightMode.bind(this);
  }

  componentDidMount() {

    newsapi.v2.topHeadlines({ 'q': 'today' }).then(response => {
        if (response && "ok" === response.status) {
          this.setState({ 
            articles: response.articles, 
            total: response.totalResults,
            loading: 'none'
          });
        }
    });
  }

  onSwitchToDarkMode() {
    document.body.className = this.props.classes.whiteOnBlack;
    this.setState({ FilterTheme: "whiteOnBlack" });
  }

  onSwitchToLightMode() {
    document.body.className = this.props.classes.blackOnWhite;
    this.setState({ FilterTheme: "blackOnWhite" });
  }

  onChangeOfFilter(language, country, category, source) {
    console.log("FILTER CHANGED!  ===>> ");
    console.log(language, country, category, source);
  }

  render() {
    var cards = this.state.articles.map((article, key) => { 
      return <News  
        key={key}
        index={key}
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

    return (
      <React.Fragment>
        <div>
        <Filter 
          language={[""]} 
          country={[""]} 
          category={[""]} 
          source={[""]} 
          onSwitchToDarkMode={this.onSwitchToDarkMode} 
          onSwitchToLightMode={this.onSwitchToLightMode}
          onFilterChange={this.onChangeOfFilter} 
        />
        </div>
        <hr />
        <div>
        <Masonry
            className={'newsapi-gallery-class'} // default ''
            elementType={'ul'} // default 'div'
            columnwidth={80}
            options={masonryOptions} // default {}
            disableImagesLoaded={false} // default false
            updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
            imagesLoadedOptions={imagesLoadedOptions} // default {}
        >{cards}</Masonry>
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(App);
