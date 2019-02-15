// import components from Material UI and React
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import CartIcon from '@material-ui/icons/ShoppingCart';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

// create styling for components
const styles = {
  root: {
    flexGrow: 1,
  },
  nav: {
    background: '#333',
  },
  navTitle: {
    margin: 20
  },
  right: {
    alignContent: 'right'
  }
};

// Stateless component that takes in props such as logo and title text
function SimpleAppBar(props) {
  const { classes } = props;
  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.nav}>
        <Toolbar>
          <Typography variant="title" color="inherit">
            {props.logo}
          </Typography>

          <Typography variant="title" color="inherit" className={classes.navTitle}>
            {props.title}
          </Typography>

          <div className={classes.right}>
            <IconButton color="inherit">
              {props.count === 0 ? <CartIcon /> :
              <Badge badgeContent={props.count} color="secondary">
                <CartIcon />
              </Badge> }
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}

SimpleAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleAppBar);
