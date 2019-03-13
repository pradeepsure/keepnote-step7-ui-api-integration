import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import NoteTaker from './NoteTaker';
import NotesContainer from './NotesContainer';
import ReminderTaker from './ReminderTaker';
import RemindersContainer from './RemindersContainer';
import CategoryTaker from './CategoryTaker';
import CategoriesContainer from './CategoriesContainer';

class NotesApp extends Component {
    render() {
        const { notes, handleAddNote, handleRemoveNote, currentPage, reminders, handleAddReminder, handleRemoveReminder, categories, handleAddCategory, handleRemoveCategory } = this.props;
        if (currentPage === 'notes') {
            return (
                <Grid container spacing={8}>
                    <Grid item xs={12}>
                        <NoteTaker handleAddNote={handleAddNote} reminders={reminders} categories={categories} />
                    </Grid>
                    <Grid item xs={12}>
                        <NotesContainer notes={notes} handleRemoveNote={handleRemoveNote} reminders={reminders} categories={categories} />
                    </Grid>
                </Grid>
            );
        } else if (currentPage === 'rem') {
            return (
                <Grid container spacing={8}>
                    <Grid item xs={12}>
                        <ReminderTaker handleAddReminder={handleAddReminder} />
                    </Grid>
                    <Grid item xs={12}>
                        <RemindersContainer reminders={reminders} handleRemoveReminder={handleRemoveReminder} />
                    </Grid>
                </Grid>
            );
        } else if (currentPage === 'cat') {
            return (
                <Grid container spacing={8}>
                    <Grid item xs={12}>
                        <CategoryTaker handleAddCategory={handleAddCategory} />
                    </Grid>
                    <Grid item xs={12}>
                        <CategoriesContainer categories={categories} handleRemoveCategory={handleRemoveCategory} />
                    </Grid>
                </Grid>
            );
        }
    }
}

export default NotesApp;