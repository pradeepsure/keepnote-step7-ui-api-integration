import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import NotificationsActive from '@material-ui/icons/NotificationsActive';
import Note from '@material-ui/icons/Note';
import Category from '@material-ui/icons/Category';
import Drafts from '@material-ui/icons/Drafts';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Settings from '@material-ui/icons/Settings';

const styles = {
    list: {
        width: 200,
    },
    fullList: {
        width: 'auto',
    },
};

class SideMenu extends React.Component {
    state = {
        top: false,
        left: false,
        bottom: false,
        right: false,
        selectedIndex: 1,
    };

    toggleDrawer = (side, open) => () => {
        this.setState({
            [side]: open,
        });
    };

    handleListItemClick = (event, index) => {
        this.setState({ selectedIndex: index });
    };

    render() {
        const { classes } = this.props;

        const sideList = (
            <div className={classes.list}>
                <List component="nav">
                    <ListItem
                        button
                        key='Notes'
                        selected={this.state.selectedIndex === 1}
                        onClick={event => this.handleListItemClick(event, 1)}
                    >
                        <ListItemIcon><Note /></ListItemIcon>
                        <ListItemText primary='Notes' />
                    </ListItem>
                    <ListItem
                        button
                        key='Categories'
                        selected={this.state.selectedIndex === 2}
                        onClick={event => this.handleListItemClick(event, 2)}
                    >
                        <ListItemIcon><Category /></ListItemIcon>
                        <ListItemText primary='Categories' />
                    </ListItem>
                    <ListItem
                        button
                        key='Reminders'
                        selected={this.state.selectedIndex === 3}
                        onClick={event => this.handleListItemClick(event, 3)}
                    >
                        <ListItemIcon><NotificationsActive /></ListItemIcon>
                        <ListItemText primary='Reminders' />
                    </ListItem>
                    <ListItem
                        button
                        key='Drafts'
                        selected={this.state.selectedIndex === 4}
                        onClick={event => this.handleListItemClick(event, 4)}
                    >
                        <ListItemIcon><Drafts /></ListItemIcon>
                        <ListItemText primary='Drafts' />
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
            <div>
                <Button onClick={this.toggleDrawer('left', true)}>Menu</Button>
                <Drawer open={this.state.left} onClose={this.toggleDrawer('left', false)}>
                    <div
                        tabIndex={0}
                        role="button"
                        onClick={this.toggleDrawer('left', false)}
                        onKeyDown={this.toggleDrawer('left', false)}
                    >
                        {sideList}
                    </div>
                </Drawer>
            </div>
        );
    }
}

SideMenu.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SideMenu);