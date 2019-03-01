import React, { Fragment } from 'react';
import ImgUrl from '../images/notes-background.png';

const WelcomePage = () => (
    <Fragment>
        <div align='center'>
            <h2 style={{ color: 'green' }}>
                Welcome to Notes App!!!. Please login to see the features!
            </h2>          
        </div>
        <img src={ImgUrl} alt="Notes App"  height="100%" width="100%"/>              
    </Fragment>
);

export default WelcomePage;