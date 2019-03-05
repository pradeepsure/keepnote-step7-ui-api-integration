import React from 'react';
import PropTypes from 'prop-types';
import { Button, TextField } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { firebase } from '../firebase/firebase';
import { history } from '../routers/AppRouter';
import { Grid } from '@material-ui/core';
//import { checkSignInErrorType } from '../utils/check-signin-error-type';

const styles = theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    textField: {
        width: '100%',
        fontSize: '4px',
        overflowWrap: 'break-word',
    },
    marginTop: {
        marginTop: theme.spacing.unit * 8,
    },
    signUpButton: {
        marginTop: theme.spacing.unit * 2,
        alignSelf: 'flex-end',
    }
});

class SignInForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password:'',
            errorMessageInUsername: '',
            errorMessageInPassword: '',
        };
        this.handleLogin = this.handleLogin.bind(this);
    }
    handleChange(name) {
        return (event => {
            this.setState({
                errorMessageInUsername: '',
                errorMessageInPassword: '',
                [name]: event.target.value,
            });
        });
    }
    handleLogin(event) {
        event.preventDefault();
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
            .then(() => {
                localStorage.setItem('isLoggedIn', true);
                history.push('/home');
            })
            .catch((error) => {
                 //const errorCode = error.code;
                 const errorMessage = error.message;
                 //const errorType = checkSignInErrorType(errorCode);
                 const errorType = 'email';
                 if (errorType === 'email') {
                    this.setState({
                        errorMessageInUsername: errorMessage,
                    });
                } else if (errorType === 'password') {
                    this.setState({
                        errorMessageInPassword: errorMessage,
                    });
                } else {
                    this.setState({
                        errorMessageInUsername: errorMessage,
                        errorMessageInPassword: errorMessage,
                    })
                }
            })
    }
    render() {
        const { classes } = this.props;
        return (
            <>
                <Grid container spacing={0}>
                    <Grid item xs={12}>
                        <form className={classes.root} onSubmit={this.handleLogin}>
                            <TextField
                                className={classes.textField}
                                required
                                autoFocus
                                error={this.state.errorMessageInUsername !== ''}
                                helperText={this.state.errorMessageInUsername ? this.state.errorMessageInUsername : ''}
                                type="email"
                                id="user-email"
                                label="Email"
                                value={this.state.email}
                                onChange={this.handleChange('email')}
                                margin="normal"
                            />
                            <TextField
                                className={classes.textField}
                                required
                                error={this.state.errorMessageInPassword !== ''}
                                helperText={this.state.errorMessageInPassword ? this.state.errorMessageInPassword : ''}
                                type="password"
                                id="user-password"
                                label="Password"
                                value={this.state.password}
                                onChange={this.handleChange('password')}
                                margin="normal"
                            />
                            <Button type="submit" color="primary" variant="outlined" className={classes.signUpButton}>
                                SignIn
                            </Button>
                        </form>
                        <div className={classes.marginTop}></div>
                    </Grid>
                </Grid>
            </>
        );
    }
}

SignInForm.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SignInForm);