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
    }

});

class NoteTaker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            noteTitle: '',
            noteDescription: '',
            error: ''
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
        });
    }

    handleNoteTitleChange(event) {
        this.setState({ noteTitle: event.target.value,  error: '' });
    }

    handleNoteDescriptionChange(event) {
        this.setState({ noteDescription: event.target.value });
    }

    handleAddNote() {
        if (!this.state.noteTitle) {
            this.setState({ error: 'Title is needed to add note' });
            return;
        }

        const newNote = {
            id: Math.random() * 2342342,
            noteTitle: this.state.noteTitle,
            noteDescription: this.state.noteDescription,
            noteCreatedBy: localStorage.getItem('loggedInUser')
        }
        this.setState({ error: '' });
        this.props.handleAddNote(newNote);
        this.handleClose();
    }

    render() {
        const { classes } = this.props;
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
