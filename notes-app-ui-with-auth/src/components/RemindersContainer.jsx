import React from 'react';
import { Grid } from '@material-ui/core';
import Reminder from './Reminder';

const RemindersContainer = (props) => (
    <Grid container spacing={8}>
        {
            props.reminders.map(reminder =>  {
                return (
                    <Grid key={reminder.reminderId} item xs={12} sm={4} xl={3}>
                        <Reminder reminder={reminder} handleRemoveReminder={props.handleRemoveReminder} />
                    </Grid>
                );
            })
        }
    </Grid>
);

export default RemindersContainer;