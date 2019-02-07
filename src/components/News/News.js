import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import red from '@material-ui/core/colors/red';
import Button from '@material-ui/core/Button';
import MoreVertIcon from '@material-ui/icons/MoreVert';
var dateFormat = require('dateformat');

const styles = theme => ({
  card: {
    maxWidth: 400,
    float: 'left',
    marginLeft: 10,
    marginTop:10
  },
  hidden: {
    display: 'none'
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  actions: {
    display: 'flex',
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
});

class News extends React.Component {
  state = { 
    expanded: false,
    key: this.props.key,
    title: this.props.title,
    date: this.props.date,
    source: this.props.source,
    url: this.props.url,
    image: this.props.image,
    author: this.props.author,
    content: this.props.content ,
    description: this.props.description,
    className: this.props.className,
    details: false
  };

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  render() {
    const { classes } = this.props;
    var mediaClasses = `${classes.media} ${this.state.image ? '' : classes.hidden}`;
    var avatar = this.props.author ? this.props.author.charAt(0).toUpperCase() 
      : this.props.title ? this.props.title.charAt(0).toUpperCase() : '?';
    var date = dateFormat(this.state.date, "dddd, mmmm dS, yyyy, h:MM:ss TT");

    return (
      <div className={this.state.className}>
        <Card key={this.state.key} className={classes.card}>
          <CardHeader
            avatar={
              <Avatar aria-label="News" className={classes.avatar}>
                {avatar}
              </Avatar>
            }
            action={
              <IconButton>
                <MoreVertIcon />
              </IconButton>
            }
            title={this.state.title}
            subheader={date}
          />
          <CardMedia
            className={mediaClasses}
            image={this.state.image}
            title={this.state.title}
          />
          <CardContent>
            <Typography component="p">
              {this.state.description}
            </Typography>
          </CardContent>
          <CardActions className={classes.actions} disableActionSpacing>
            <Button size="small" color="primary" href={this.state.url} target="_blank">
              View Article
            </Button>
          </CardActions>
        </Card>
      </div>
    );
  }
}

News.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(News);