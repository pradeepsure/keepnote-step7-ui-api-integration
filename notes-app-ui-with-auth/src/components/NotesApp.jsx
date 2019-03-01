import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import NoteTaker from './NoteTaker';
import NotesContainer from './NotesContainer';

class NotesApp extends Component {
    render() {
        const { notes, handleAddNote, handleRemoveNote } = this.props;
        return (
            <Grid container spacing={8}>
                <Grid item xs={12}>
                    <NoteTaker handleAddNote={handleAddNote} />
                </Grid>
                <Grid item xs={12}>
                    <NotesContainer notes={notes} handleRemoveNote={handleRemoveNote} />
                </Grid>
            </Grid>
        );
    }
}

export default NotesApp;