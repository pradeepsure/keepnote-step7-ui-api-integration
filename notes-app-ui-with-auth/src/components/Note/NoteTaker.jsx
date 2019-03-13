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
import Typography from '@material-ui/core/Typography';

import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';

const styles = theme => ({
    fab: {
        margin: theme.spacing.unit * 2,
    },
    absolute: {
        position: 'absolute',
        bottom: theme.spacing.unit * 2,
        right: theme.spacing.unit * 3,
    },
    error: {
        color: 'red'
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 120,
        maxWidth: 300,
    },
    selectEmpty: {
        marginTop: theme.spacing.unit * 2,
    },
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const SelectMenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

class NoteTaker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            noteTitle: '',
            noteDescription: '',
            error: '',
            reminderId: '',
            reminderName: '',
            selectedReminders: [],
            category: '',
        };
        this.handleClickOpen = this.handleClickOpen.bind(this);
        this.handleAddNote = this.handleAddNote.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleNoteTitleChange = this.handleNoteTitleChange.bind(this);
        this.handleNoteDescriptionChange = this.handleNoteDescriptionChange.bind(this);
    }

    handleClickOpen() {       
        this.setState({ open: true });
    }

    handleClose() {
        this.setState({
            open: false,
            noteTitle: '',
            noteDescription: '',
            error: '',
            selectedReminders: [],
            category: ''            
        });
    }

    handleNoteTitleChange(event) {
        this.setState({ noteTitle: event.target.value, error: '' });
    }

    handleNoteDescriptionChange(event) {
        this.setState({ noteDescription: event.target.value });
    }

    handleAddNote() {
        if (!this.state.noteTitle) {
            this.setState({ error: 'Title is needed to add note' });
            return;
        }

        let selReminders = [];
        if (this.props.reminders.length > 0 && this.state.selectedReminders.length > 0) {
            this.state.selectedReminders.forEach(reminderName => {
                let sRem = this.props.reminders.find(reminder => {
                    if (reminder.reminderName === reminderName) return reminder;
                });
                selReminders.push(sRem);
            });
        }

        const dummyCategory = {
            id: Math.random() * 123456,
            categoryCreatedBy: localStorage.getItem('loggedInUser'),
            categoryDescription: "Sample Category Desc",
            categoryName: "Sample Category Name"
        };

        let category = {};
        if (this.state.category !== "") {
            console.log(" Here ");
            category = this.state.category;
        } else {
            category = dummyCategory;
        }

        const newNote = {
            id: Math.random() * 2342342,
            noteTitle: this.state.noteTitle,
            noteDescription: this.state.noteDescription,
            noteCreatedBy: localStorage.getItem('loggedInUser'),
            reminders: selReminders,
            category: category,
        }
        this.setState({ error: '' });
        this.props.handleAddNote(newNote);
        this.handleClose();
    }

    handleReminderChange = event => {
        this.setState({ selectedReminders: event.target.value });
    };

    handleCategoryChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        const { classes, reminders, categories } = this.props;
        return (
            <Fragment>
                <Tooltip title="Add Note" aria-label="Add note">
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
                    aria-labelledby="Add note form"
                >
                    <DialogTitle id="Add note form">
                        Add Note
                    </DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="note title"
                            label="Note Title"
                            type="text"
                            fullWidth
                            onChange={this.handleNoteTitleChange}
                            value={this.state.noteTitle}
                        />
                        <TextField
                            margin="dense"
                            id="note description"
                            label="Note Description"
                            type="text"
                            onChange={this.handleNoteDescriptionChange}
                            value={this.state.noteDescription}
                            fullWidth
                        />
                        <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="select-multiple-checkbox">Reminders</InputLabel>
                            <Select
                                multiple
                                value={this.state.selectedReminders}
                                onChange={this.handleReminderChange}
                                input={<Input id="select-multiple-checkbox" />}
                                renderValue={selected => selected.join(', ')}
                                MenuProps={SelectMenuProps}
                            >
                                {reminders.map(reminder => (
                                    <MenuItem key={reminder.reminderId} value={reminder.reminderName}>
                                        <Checkbox checked={this.state.selectedReminders.indexOf(reminder.reminderName) > -1} />
                                        <ListItemText primary={reminder.reminderName} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="category-simple">Category</InputLabel>
                            <Select
                                value={this.state.category}
                                onChange={this.handleCategoryChange}
                                inputProps={{
                                    name: 'category',
                                    id: 'category-simple',
                                }}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {
                                    categories.map(category => (
                                        <MenuItem key={category.id} value={category}>
                                            <ListItemText primary={category.categoryName} />
                                        </MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                    </DialogContent>
                    <Typography className={classes.error} component={'span'} >
                        {this.state.error}
                    </Typography>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.handleAddNote} color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        );
    }
}

export default withStyles(styles)(NoteTaker);
