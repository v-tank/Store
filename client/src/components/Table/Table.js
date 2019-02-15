// import packages and files to create table
import axios from 'axios';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import classNames from 'classnames';
import DeleteIcon from '@material-ui/icons/Delete';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FAB from '../FAB';
import IconButton from '@material-ui/core/IconButton';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import UpdateIcon from '@material-ui/icons/Update';
import { withStyles } from '@material-ui/core/styles';

// function to sort entries in table
function getSorting(order, orderBy) {
  return order === 'desc'
    ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
    : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);
}

// create column names for table
const columnData = [
  { id: 'streetAddr', numeric: false, disablePadding: true, label: 'Street Address' },
  { id: 'city', numeric: false, disablePadding: false, label: 'City' },
  { id: 'state', numeric: false, disablePadding: false, label: 'State' },
  { id: 'stateAbbr', numeric: false, disablePadding: true, label: 'State Abbreviation' },
  { id: 'zipcode', numeric: true, disablePadding: false, label: 'Zipcode' },
  { id: 'lat', numeric: true, disablePadding: false, label: 'Latitude' },
  { id: 'long', numeric: true, disablePadding: false, label: 'Longitude' },
];

// define class for Table Header
class EnhancedTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount } = this.props;

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={numSelected === rowCount}
              onChange={onSelectAllClick}
            />
          </TableCell>
          {columnData.map(column => {
            return (
              <TableCell
                key={column.id}
                numeric={column.numeric}
                padding={column.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === column.id ? order : false}
              >
                <Tooltip
                  title="Sort"
                  placement={column.numeric ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === column.id}
                    direction={order}
                    onClick={this.createSortHandler(column.id)}
                  >
                    {column.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            );
          }, this)}
        </TableRow>
      </TableHead>
    );
  }
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit,
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
  },
});

// define table toolbar component to show table title and actions bar when items are selected
let EnhancedTableToolbar = props => {
  const { numSelected, classes, handleClickOpen, handleClose, handleSubmit, handleDelete, open } = props;

  return (
    <Toolbar
      className={classNames(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      <div className={classes.title}>
        {numSelected > 0 ? (
          <Typography color="inherit" variant="subheading">
            {numSelected} selected
          </Typography>
        ) : (
          <Typography variant="title" id="tableTitle">
            Products
          </Typography>
        )}
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        {numSelected > 0 ? (
          <div>
            {/* Need to add update functionality */}
            <Tooltip title="Update">
            <IconButton aria-label="Update" style={{display: 'inline'}} onClick={() => handleDelete()}>
              <UpdateIcon />
            </IconButton>
          </Tooltip>

            {/* Handles delete functionality for the table data; calls function to make a DELETE request */}
            <Tooltip title="Delete">
              <IconButton aria-label="Delete" style={{display: 'inline'}} onClick={() => handleDelete()}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </div>

        ) : (
          <Tooltip title="Add entry">
            <FAB handleClickOpen={handleClickOpen} handleClose={handleClose} handleSubmit={handleSubmit} open={open}/>
          </Tooltip>
        )}
      </div>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
};

EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 1020,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
});

// Create table
class EnhancedTable extends React.Component {
  constructor(props) {
    super(props);

    // state to hold important info such as selected rows and obj to be created
    this.state = {
      order: 'asc',
      orderBy: 'city',
      selected: [],
      data: this.props.products,
      page: 0,
      rowsPerPage: 10,
      open: false,
      streetAddr: '',
      city: '',
      state: '',
      stateAbbr: '',
      zipcode: '',
      lat: '',
      long: ''
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({data: nextProps.products})
  }

  // function that opens form dialog to add product
  handleClickOpen = () => {
    this.setState({ open: true });
  };

  // function to handle submit
  handleSubmit = () => {
    // console.log("Submitting");
    if (this.state.streetAddr === '' || this.state.city === '' || this.state.state === '' || this.state.stateAbbr === '' || this.state.zipcode === '' || this.state.lat === '' || this.state.long === '') {
      // if a field is left blank, alert the user that every field is requried
      alert("Please fill out all the fields!");
    } else {
      // make API call using the below object
      var obj = {
				city: this.state.city,
				state: this.state.state,
				stateAbbr: this.state.stateAbbr,
				streetAddress: this.state.streetAddr,
				latitude: Number(this.state.lat),
				longitude: Number(this.state.long),
				zipcode: Number(this.state.zipcode)
      }

      // using axios, hit a POST route to add the object to the db
      axios.post('/api/product/', obj).then(res => {
        this.handleClose();   // closes the form dialog
        this.props.startLoadAnimation();  // starts animation to refresh table data

        var queryURL = '/api/product';
        // make a GET request to retrieve all data
        axios.get(queryURL).then(response => {
          this.props.updateStateAfterFetch(response.data);
        });
      }).catch(err => {
				console.log(err);
			});
    }
  }

  // function to close form dialog
  handleClose = () => {
    this.setState({ open: false });
  };

  // function to update state when user types in form dialog
  handleInputChange = event => {
    // Getting the value and name of the input which triggered the change
    let value = event.target.value;
    const id = event.target.id;

    this.setState({
      [id]: value
    });
  };

  // function that deletes all selected items from table when the delete button is clicked
  handleDelete = () => {
    this.props.startLoadAnimation();

    this.state.selected.forEach(el => {
      var result = this.state.data.filter(entry => entry.id === el);  // finds objectID of selected items from array using .filter()
      var entryToDelete = result[0]["oid"];
      // console.log('/api/product/' + entryToDelete);

      axios.delete('/api/product/' + entryToDelete).then(res => {
        var queryURL = '/api/product';
        axios.get(queryURL).then(response => {
          this.props.updateStateAfterFetch(response.data);
        });
      })
    });


    this.setState({selected: []});  // reset selected array to [] once rows have been deleted
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  handleSelectAllClick = (event, checked) => {
    if (checked) {
      this.setState(state => ({ selected: state.data.map(n => n.id) }));
      return;
    }
    this.setState({ selected: [] });
  };

  handleClick = (event, id) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    this.setState({ selected: newSelected });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  render() {
    const { classes } = this.props;
    const { data, order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
    // console.log(this.state.data);
    // console.log(this.state.selected);

    return (
      <Paper className={classes.root}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          handleClickOpen={this.handleClickOpen.bind(this)}
          handleClose={this.handleClose.bind(this)}
          handleSubmit={this.handleSubmit.bind(this)}
          handleDelete={this.handleDelete.bind(this)}
          open={this.state.open}
        />

        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={this.handleSelectAllClick}
              onRequestSort={this.handleRequestSort}
              rowCount={data.length}
            />
            <TableBody>
              {data
                .sort(getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(n => {
                  const isSelected = this.isSelected(n.id);
                  return (
                    <TableRow
                      hover
                      onClick={event => this.handleClick(event, n.id)}
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={n.id}
                      selected={isSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox checked={isSelected} />
                      </TableCell>
                      <TableCell component="th" scope="row" padding="none">
                        {n.streetAddr}
                      </TableCell>
                      <TableCell>{n.city}</TableCell>
                      <TableCell>{n.state}</TableCell>
                      <TableCell>{n.stateAbbr}</TableCell>
                      <TableCell numeric>{n.zipcode}</TableCell>
                      <TableCell numeric>{n.lat}</TableCell>
                      <TableCell numeric>{n.long}</TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            'aria-label': 'Previous Page',
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page',
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />

        {/* Create dialog box and open when 'Add' button is clicked */}
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Add a Product</DialogTitle>
          <DialogContent>

            <TextField
              onChange={this.handleInputChange}
              autoFocus
              required
              margin="dense"
              id="streetAddr"
              label="Street Address"
              type="text"
              fullWidth
            />

            <TextField
              onChange={this.handleInputChange}
              required
              margin="dense"
              id="city"
              label="City"
              type="text"
              fullWidth
            />

            <TextField
              onChange={this.handleInputChange}
              required
              margin="normal"
              id="state"
              label="State"
              type="text"
            />

            <TextField
              onChange={this.handleInputChange}
              required
              margin="normal"
              id="stateAbbr"
              label="State Abbreviation"
              type="text"
            />

            <TextField
              onChange={this.handleInputChange}
              required
              margin="dense"
              id="zipcode"
              label="Zipcode"
              type="string"
            />

            <TextField
              onChange={this.handleInputChange}
              required
              margin="normal"
              id="lat"
              label="Latitude"
              type="string"
            />

            <TextField
              onChange={this.handleInputChange}
              required
              margin="normal"
              id="long"
              label="Longitude"
              type="string"
            />


          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="secondary">
              Cancel
            </Button>
            <Button onClick={this.handleSubmit} color="primary">
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    );
  }
}

EnhancedTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EnhancedTable);
