import React, { Component } from 'react';
import { Card, CardHeader, CardContent, CardActions, withStyles } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

const styles = theme => ({
    deleteIcon: {
        justifyContent: 'flex-end',
    }
});

class Category extends Component {
    render() {
        const { classes, handleRemoveCategory, category } = this.props;
        return (
            <Card style={{background: `rgba(${ category.color.r }, ${ category.color.g }, ${ category.color.b }, ${ category.color.a })`}} >
                <CardHeader
                    title={category.categoryName}                   
                />
                <CardContent>
                    {category.categoryDescription}
                </CardContent>
                <CardActions className={classes.deleteIcon}>
                    <IconButton onClick={handleRemoveCategory.bind(null, category.id)}>
                        <DeleteIcon />
                    </IconButton>
                </CardActions>
            </Card>
        );
    }
}

export default withStyles(styles)(Category);