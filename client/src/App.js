// import files and packages
import './App.css';
import AppBar from './components/AppBar';
import axios from 'axios';
import CircularProgress from './components/CircularProgress/CircularProgress';
// import DebounceInput from './components/DebounceInput/DebounceInput';
import Grid from '@material-ui/core/Grid';
import React, { Component } from 'react';
import ProductTile from './components/ProductTile';
import { withStyles } from '@material-ui/core/styles';

// let counter = 0;

// styling for the app page
const styles = () => ({
  root: {
    flexGrow: 1,
  },
  demo: {
    height: '100vh',
  },
  app: {
    textAlign: 'center',
    height: '100vh',
    flex: 1
  },
});

// define App that extends React's Component class
class App extends Component {

  state = {
    cart: [], // array to hold all table rows
    loading: true,  // bool that holds loading state
    searchQuery: '',   // holds search query,
    products: JSON.parse(window.localStorage.getItem('products')) || []
  }

  // function to define state and recreate table once fetched data has been received
  // updateStateAfterFetch = (arr) => {
  //   console.log(arr);
  //   this.setState({searchQuery: '', products: [], loading: true});

  //   this.setState({searchQuery: '', loading: false});
  // }

  // loading animation function
  startLoadAnimation = () => {
    this.setState({loading: true});
  }

  // update search query with string typed in textbox
  updateSearchState = (str) => {
    this.setState({searchQuery: str});

    // if empty query string, refetch all data
    if (this.state.searchQuery === '') {
      this.setState({data: [], loading: true}); // empty state array and start loading animation

      var queryURL = '/api/product'; // define query route for GET request

      // make a GET request using axios
      axios.get(queryURL)
        .then(res => {
          // map through response array to create table rows and update state array
          res.data.map(el => {
            return(el);
          });

          this.setState({searchQuery: '', loading: false}); // stop loading animation
        });
    }
  }

  // function to fetch all data when componentWillMount
  componentWillMount() {
    this.startLoadAnimation();
    var queryURL = '/api/product';

    // make a GET request using axios
    if (this.state.products.length === 0) {
      axios.get(queryURL)
      .then(res => {
        // console.log(res.data);
        window.localStorage.setItem('products', JSON.stringify(res.data));
        return this.setState({
          products: res.data,
          loading: false
        })
      });
    }

  }

  render() {
    const { classes } = this.props;
    // console.log(this.state.products);
    return (
      <div className={classes.app}>
        {/* Create AppBar and pass in logo, title, and cart count as props */}
        <AppBar logo="🌎" title="Product Store" count={this.state.cart.length}/>

        {/* Create DebounceInput component and pass functions as props */}
        {/* <DebounceInput className={classes.searchBar} updateStateAfterFetch={this.updateStateAfterFetch} updateSearchState={this.updateSearchState}/>
        */}

        {/* Create Grid to hold the table */}
         <Grid container className={classes.root}>
          <Grid item xs={12}>
            <Grid
              container
              alignItems='center'
              justify='center'
            >

            {this.state.products.map(product => (
              <ProductTile
                id={product.id}
                key={product.id}
                name={product.name}
                imgURL={product.imgURL}
                department={product.department}
                price={product.price}
                // ADD TO CART METHOD NEEDS TO BE IMPLEMENTED
              />
            ))}

            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(App);
