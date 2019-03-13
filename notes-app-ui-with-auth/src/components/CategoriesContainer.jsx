import React from 'react';
import { Grid } from '@material-ui/core';
import Category from './Category';

const CategoriesContainer = (props) => (
    <Grid container spacing={8}>
        {((props.categories.length > 0) ?
            (props.categories.map(category => {
                return (
                    <Grid key={category.id} item xs={12} sm={4} xl={3}>
                        <Category category={category} handleRemoveCategory={props.handleRemoveCategory} />
                    </Grid>
                );
            })) : (<div align='center'>
                <h2 style={{ color: 'green' }}>
                    No Categories to display!!!. Please add
                </h2>
            </div>))
        }
    </Grid>
);

export default CategoriesContainer;