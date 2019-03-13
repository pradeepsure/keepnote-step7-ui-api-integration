import React, { Component, Fragment } from 'react';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { withStyles } from '@material-ui/core';
import { Tooltip } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import ColorPicker from 'react-color';
import ColorLensIcon from '@material-ui/icons/ColorLens';

const styles = theme => ({
    fab: {
        margin: theme.spacing.unit * 2,
    },
    absolute: {
        position: 'absolute',
        bottom: theme.spacing.unit * 2,
        right: theme.spacing.unit * 3,
    },
    color: {
        width: '36px',
        height: '14px',
        borderRadius: '2px',
        background: 'black',
    },
    swatch: {
        padding: '5px',
        background: '#fff',
        borderRadius: '1px',
        boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
        display: 'inline-block',
        cursor: 'pointer',
    },
    popover: {
        position: 'fixed',
        zIndex: '2',
    },
});

class CategoryTaker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            categoryName: '',
            categoryDescription: '',
            color: {
                r: '255',
                g: '255',
                b: '255',
                a: '1',
            },
            background: 'black',
            displayColorPicker: false,
        };
        this.handleClickOpen = this.handleClickOpen.bind(this);
        this.handleAddCategory = this.handleAddCategory.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleCategoryTitleChange = this.handleCategoryTitleChange.bind(this);
        this.handleCategoryDescriptionChange = this.handleCategoryDescriptionChange.bind(this);
        this.handleColorClose = this.handleColorClose.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleClickOpen() {
        this.setState({ open: true });
    }

    handleClose() {
        this.setState({
            open: false,
            categoryName: '',
            categoryDescription: '',
            color: {
                r: '255',
                g: '255',
                b: '255',
                a: '1',
            },
            background: 'black',
        });
    }

    handleCategoryTitleChange(event) {
        this.setState({ categoryName: event.target.value });
    }

    handleCategoryDescriptionChange(event) {
        this.setState({ categoryDescription: event.target.value });
    }

    handleAddCategory() {
        const newCategory = {
            id: Math.random() * 654321,
            categoryName: this.state.categoryName,
            categoryDescription: this.state.categoryDescription,
            color: this.state.color,
            categoryCreatedBy: localStorage.getItem('loggedInUser'),
        }
        this.props.handleAddCategory(newCategory);
        this.handleClose();
    }

    handleClick = () => {
        this.setState({ displayColorPicker: !this.state.displayColorPicker })
    };

    handleColorClose = () => {
        this.setState({ displayColorPicker: false })
    };

    handleChange = (color) => {
        this.setState({ color: color.rgb, background: color.hex })
    };

    render() {
        const { classes } = this.props;
        const cover = {
            position: 'fixed',
            top: '0px',
            right: '0px',
            bottom: '0px',
            left: '0px',
        }
        return (
            <Fragment>
                <Tooltip title="Add Category" aria-label="Add Category">
                    <Fab
                        color="secondary"
                        className={classes.absolute}
                        onClick={this.handleClickOpen}
                    >
                        <AddIcon />
                    </Fab>
                </Tooltip>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="Add Category form"
                >
                    <DialogTitle id="Add Category form" align="end">
                    <div style={{ display: 'flex', justifyContent: 'space-between'}}>
                        Add Category
                            <div style={styles.swatch} onClick={this.handleClick}>
                            <ColorLensIcon className={classes.iconHover} style={{ fontSize: 30 ,color: this.state.background}} />
                        </div>
                        {this.state.displayColorPicker ? <div className={classes.popover}>
                            <div style={cover} onClick={this.handleColorClose} />
                            <ColorPicker color={this.state.color}
                                onChangeComplete={this.handleChange} />
                        </div> : null}
                        </div>
                    </DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="Category title"
                            label="Category Title"
                            type="text"
                            fullWidth
                            onChange={this.handleCategoryTitleChange}
                            value={this.state.categoryName}
                        />
                        <TextField
                            margin="dense"
                            id="Category description"
                            label="Category Description"
                            type="text"
                            onChange={this.handleCategoryDescriptionChange}
                            value={this.state.categoryDescription}
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.handleAddCategory} color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </Fragment >
        );
    }
}

export default withStyles(styles)(CategoryTaker);
