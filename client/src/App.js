// import files and packages
import './App.css';
import AppBar from './components/AppBar';
import axios from 'axios';
import CircularProgress from './components/CircularProgress/CircularProgress';
import React, { Component } from 'react';
import ProductTile from './components/ProductTile';
import { withStyles } from '@material-ui/core/styles';
import Wrapper from './components/Wrapper';

let counter = 0;
function createData(name, department, price, imgURL) {
  counter += 1;
  return { id: counter, name, department, price, imgURL };
}

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
    cart: [], // array to hold all purchased ds
    loading: true,  // bool that holds loading state
    products: []
  }

  purchaseItem = (id, name) => {
    this.setState({
      cart: [...this.state.cart, id]
    });
    console.log(`Added ${name} to the cart!`);

    const notPurchased = this.state.products.filter(prod => prod.id !== id);
    this.setState({products: notPurchased});
  }

  // function to fetch all data when componentWillMount
  componentWillMount() {
    var queryURL = '/api/product';

    // make a GET request using axios
    axios.get(queryURL)
      .then(res => {

        res.data.map(el => {
          return this.setState({
            products: [...this.state.products, createData(el.productName, el.department, el.price, el.imgURL)]
          });
        });
        this.setState({loading: false});  // stop loading animation
      });
    }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.app}>
        {/* Create AppBar and pass in logo, title, and cart count as props */}
        <AppBar logo="🌎" title="Product Store" count={this.state.cart.length}/>

        {this.state.loading ? <CircularProgress /> :
          (
            <Wrapper>
            {this.state.products.map(product => (
                <ProductTile
                  purchaseItem={this.purchaseItem}
                  id={product.id}
                  key={product.id}
                  name={product.name}
                  department={product.department}
                  price={product.price}
                  imgURL={product.imgURL}
                />
              ))}
            </Wrapper>
          )
        }

      </div>
    );
  }
}

export default withStyles(styles)(App);
