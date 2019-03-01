import React from 'react';
import { Grid } from '@material-ui/core';
import Note from './Note';

const NotesContainer = (props) => (
    <Grid container spacing={8}>
        {
            props.notes.map(note =>  {
                return (
                    <Grid key={note.id} item xs={12} sm={4} xl={3}>
                        <Note note={note} handleRemoveNote={props.handleRemoveNote} />
                    </Grid>
                );
            })
        }
    </Grid>
);

export default NotesContainer;