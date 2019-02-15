// import packages
import React from 'react';
import {DebounceInput} from 'react-debounce-input';
import axios from 'axios';

// create styles for input box
const styles = {
  searchBar: {
    margin: 20,
  },
  input: {
    width: 400,
    height: 30,
    fontSize: 16,
    textAlign: 'center',
    display: 'inline'
  }
}

// Stateful component to hold search string
class Search extends React.Component {
  state = {
    value: ''
  };

  // update state with input text and call ajax function
  updateLocalState = (e) => {
    // console.log(e.target.value);
    this.setState({value: e.target.value})
    this.props.updateSearchState(this.state.value);
    this.ajaxCall(this.state.value);
  }

  // function to take in query and make a POST request using axios
  ajaxCall = (query) => {
    var queryURL = '/api/product/search/' + query;
    axios.post(queryURL).then(response => {
      // console.log(response.data);
      // update parent's state with fetched data
      this.props.updateStateAfterFetch(response.data);
    });
  }

  render() {
    return (
      <div style={styles.searchBar}>
        {/* Create debounce input that starts searching after 3 chars inputted and fetches after 1s */}
        <DebounceInput
          minLength={3}
          debounceTimeout={1000}
          onChange={this.updateLocalState}
          placeholder="Search for a product..."
          style={styles.input}
        />
      </div>
    );
  }
}

export default Search;
