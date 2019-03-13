import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import SearchBar from './SearchBar';
import { Button } from '@material-ui/core';
import DescriptionIcon from '@material-ui/icons/Description';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { firebase } from '../firebase/firebase';
import { Link } from "react-router-dom";

import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import NotificationsActive from '@material-ui/icons/NotificationsActive';
import Note from '@material-ui/icons/Note';
import Category from '@material-ui/icons/Category';
import Delete from '@material-ui/icons/Delete';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Settings from '@material-ui/icons/Settings';

const styles = theme => ({
  root: {
    width: '100%',
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  grow: {
    flexGrow: 1
  },
  list: {
    width: 200,
  },
  link: {
    textDecoration: 'none',
    color: 'white' 
  },
});

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: localStorage.getItem('isLoggedIn') || false,
      top: false,
      left: false,
      bottom: false,
      right: false,
      selectedIndex: 1,
    }
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleNoteCurrentPage = this.handleNoteCurrentPage.bind(this);
    this.handleRemCurrentPage = this.handleRemCurrentPage.bind(this);
    this.handleCatCurrentPage = this.handleCatCurrentPage.bind(this);
    this.handleDeleteUser = this.handleDeleteUser.bind(this);
  }

  handleNoteCurrentPage() {
    this.setState({ selectedIndex: 1 });
    this.props.handleCurrentPage('notes');
  }
  handleCatCurrentPage() {
    this.setState({ selectedIndex: 2 });
    this.props.handleCurrentPage('cat');
  }
  handleRemCurrentPage() {
    this.setState({ selectedIndex: 3 });
    this.props.handleCurrentPage('rem');
  }

  // life cycle method to get the props for child component when parent component rerenders
  componentWillReceiveProps() {
    if (this.props.isLoggedIn && localStorage.getItem('isLoggedIn')) {
      this.setState({ isLoggedIn: true });
    }
  }

  // handleLogin() {
  //   return firebase.auth().signInWithPopup(googleAuthProvider).then(success => {
  //     var user = firebase.auth().currentUser;
  //     if (user != null) {
  //       localStorage.setItem('loggedInUser', user.email);
  //     }

  //     localStorage.setItem('isLoggedIn', true);
  //     this.setState({ isLoggedIn: true });
  //     this.props.handleLoadData();
  //   })
  // }

  handleLogin() {
    // dummy method. Login now happens in AuthenticationForm or ThirdPartyLogin components
  }

  // handleLogout(event) {
  //   event.preventDefault();
  //   const confLogout = window.confirm("Do you really want to Sign Out?");
  //   if (confLogout === true) {
  //     localStorage.removeItem('isLoggedIn', false);
  //     localStorage.removeItem('loggedInUser');
  //     this.setState({ isLoggedIn: false });
  //     return firebase.auth().signOut();
  //   } 
  // }

  //perform logout and redirect to login
  handleLogout() {
    localStorage.removeItem('isLoggedIn', false);
    localStorage.removeItem('loggedInUser');
    this.setState({ isLoggedIn: false });
    return firebase.auth().signOut();
  }

  // Since user is deleted, perform logout
  handleDeleteUser() {
    const confDelete = window.confirm("Are you sure to delete this user? \nYou need to Sign Up again to login");
    if (confDelete === true) {
      this.props.handleDeleteUser();
      this.handleLogout();
    }
  }

  // Menu Section - START
  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open,
    });
  };

  handleListItemClick = (event, index) => {
    this.setState({ selectedIndex: index });
  };
  // Menu Section - END

  render() {
    const { classes } = this.props;
    // Object destructruing -- if assignee and variable name is same then we can do below
    // instead of isLoggedIn = this.state.isLoggedIn -- as both we are using same name
    const { isLoggedIn } = this.state;

    const sideList = (
      <div className={classes.list}>
        <List component="nav">
          {/* <ListItem
            button
            key='Notes'
            selected={this.state.selectedIndex === 1}
            onClick={event => this.handleListItemClick(event, 1)}
          >
            <ListItemIcon><Note /></ListItemIcon>
            <ListItemText primary='Notes' />
          </ListItem> */}
          <ListItem
            button
            key='Notes'
            selected={this.state.selectedIndex === 1}
            onClick={this.handleNoteCurrentPage}
          >
            <ListItemIcon><Note /></ListItemIcon>
            <ListItemText primary='Notes' />
          </ListItem>
          <ListItem
            button
            key='Categories'
            selected={this.state.selectedIndex === 2}
            onClick={this.handleCatCurrentPage}
          >
            <ListItemIcon><Category /></ListItemIcon>
            <ListItemText primary='Categories' />
          </ListItem>
          <ListItem
            button
            key='Reminders'
            selected={this.state.selectedIndex === 3}
            onClick={this.handleRemCurrentPage}
          >
            <ListItemIcon><NotificationsActive /></ListItemIcon>
            <ListItemText primary='Reminders' />
          </ListItem>
          <ListItem
            button
            key='Delete'
            selected={this.state.selectedIndex === 4}
            onClick={this.handleDeleteUser}
          >
            <ListItemIcon><Delete /></ListItemIcon>
            <ListItemText primary='Delete User' />
          </ListItem>
        </List>
        <Divider />
        <List>
          {['Admin', 'Settings'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>{index % 2 === 0 ? <AccountCircle /> : <Settings />}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </div>
    );

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            {isLoggedIn ? <div><IconButton className={classes.menuButton} color="inherit" aria-label="Menu" onClick={this.toggleDrawer('left', true)}>
              <MenuIcon />
            </IconButton> <Drawer open={this.state.left} onClose={this.toggleDrawer('left', false)}>
                <div
                  tabIndex={0}
                  role="button"
                  onClick={this.toggleDrawer('left', false)}
                  onKeyDown={this.toggleDrawer('left', false)}
                >
                  {sideList}
                </div>
              </Drawer> </div> : <DescriptionIcon />}
            <Typography className={classes.title} variant="h6" color="inherit" noWrap>
              Keep - Notes
            </Typography>
            {isLoggedIn ? <SearchBar filterData={this.props.filterData} /> : ''}
            <div className={classes.grow} />
            {/* {isLoggedIn ? <div>              
              <Button className={classes.button} onClick={currentPage === 'notes' ? this.handleRemCurrentPage : this.handleNoteCurrentPage}>
                {currentPage === 'notes' ? 'View Remainders' : 'View Notes'}
              </Button>
            </div> : ''} */}
            <Link className={classes.link} to="/login" ><Button  onClick={isLoggedIn ? this.handleLogout : this.handleLogin}>
              {isLoggedIn ? 'Logout' : 'Login'}
            </Button></Link>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Header);    // HOC -> Higher Order Component which takes another compoennt as an argument