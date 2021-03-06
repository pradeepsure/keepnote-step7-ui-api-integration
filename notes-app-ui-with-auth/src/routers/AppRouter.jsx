import React, { Component, Fragment } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import Header from '../components/Header/Header';
import WelcomePage from '../components/WelcomePage';
import NotesApp from '../components/NotesApp';
import EditNote from '../components/Note/EditNote';
import createHistory from 'history/createBrowserHistory';
import { green, pink } from '@material-ui/core/colors';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

import AuthenticationForm from '../components/Authentication/AuthenticationForm';
import ProtectedRoute from './ProtectedRoute';

const theme = createMuiTheme({
    palette: {
        primary: green,
        secondary: pink
    },
    typography: {
        useNextVariants: true,
    },
});

export const history = createHistory();

const USER_API_BASE_URL = 'http://localhost:8080/user-service/api/v1/user';
const NOTE_API_BASE_URL = 'http://localhost:8082/note-service/api/v1/note';
const REMINDER_API_BASE_URL = 'http://localhost:8085/reminder-service/api/v1/reminder';
const CATEGORY_API_BASE_URL = 'http://localhost:8083/category-service/api/v1/category';

class AppRouter extends Component {
    // filteredNotes is used to show the matching notes during search
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: false,
            currentPage: 'notes',
            notes: [],
            filteredNotes: [],            
            reminders: [],
            filteredReminders: [],
            categories: [],
            filteredCategories: [],            
        };
        this.handleLogin = this.handleLogin.bind(this);
        this.handleCurrentPage = this.handleCurrentPage.bind(this);
        this.handleLoadData = this.handleLoadData.bind(this);

        this.handleAddNote = this.handleAddNote.bind(this);
        this.handleRemoveNote = this.handleRemoveNote.bind(this);
        this.handleUpdateNote = this.handleUpdateNote.bind(this);
        
        this.handleAddReminder = this.handleAddReminder.bind(this);
        this.handleRemoveReminder = this.handleRemoveReminder.bind(this);

        this.handleAddCategory = this.handleAddCategory.bind(this);
        this.handleRemoveCategory = this.handleRemoveCategory.bind(this);

        this.handleDeleteUser = this.handleDeleteUser.bind(this);
    }

    handleLogin() {
        this.setState(currState => ({
            isLoggedIn: true,
            currentPage: 'notes'
        }));
        this.handleLoadData();
    }

    // react life cycle method called once when the page is getting loaded
    componentDidMount() {
        // Get all the notes      
        if (localStorage.getItem('isLoggedIn')) {
            this.handleLoadData();
        }
    }

    handleLoadData() {
        this.getAllNotes();
        this.getAllReminders();
        this.getAllCategories();
    }

    getAllNotes() {
        // Get all the notes
        let loggedInUser = localStorage.getItem('loggedInUser');
        fetch(`${NOTE_API_BASE_URL}/${loggedInUser}`)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                else if (response.status === 404) {
                    return Promise.reject(new Error('Invalid URL'))
                }
                else if (response.status === 401) {
                    return Promise.reject(new Error('UnAuthorized User...'));
                }
                else {
                    return Promise.reject(new Error('Some internal error occured...'));
                }
            })
            .then(userNotes => this.setState({
                notes: userNotes,
                filteredNotes: userNotes
            })).catch(error => {
                console.log("Note Service - getAllNotes Exception");
            })
    }

    handleAddNote(note) {
        fetch(`${NOTE_API_BASE_URL}`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(note)
        }).then(response => response.json())
            .then(note => {
                this.setState((currState) => ({
                    notes: currState.notes.concat([note]),
                    filteredNotes: currState.notes.concat(note)
                }));
            }).catch(error => {
                console.log("Note Service - handleAddNote Exception");
            })
    }

    handleRemoveNote(noteId) {
        let loggedInUser = localStorage.getItem('loggedInUser');
        fetch(`${NOTE_API_BASE_URL}/${loggedInUser}/${noteId}`, {
            method: 'DELETE',
            headers: { "Content-Type": "application/json" }
        }).then(response => {
            const noteIndexToRemove = this.state.notes.findIndex(note => note.id === noteId);
            this.setState((currState) => ({
                notes: [...currState.notes.slice(0, noteIndexToRemove), ...currState.notes.slice(noteIndexToRemove + 1)],
                filteredNotes: [...currState.notes.slice(0, noteIndexToRemove), ...currState.notes.slice(noteIndexToRemove + 1)]
            }));
        }).catch(error => {
            console.log("Note Service - handleRemoveNote Exception");
        })
    }

    // ...updateNote ... is spread operator which eventually passes the value in the object / variable used along with it.
    handleUpdateNote(updatedNote) {
        let loggedInUser = localStorage.getItem('loggedInUser');
        fetch(`${NOTE_API_BASE_URL}/${loggedInUser}/${updatedNote.id}`, {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedNote)
        }).then(response => response.json())
            .then(note => {
                const noteIndexToUpdate = this.state.notes.findIndex(note => note.id === updatedNote.id);
                this.setState((currState) => ({
                    notes: [...currState.notes.slice(0, noteIndexToUpdate), { ...updatedNote }, ...currState.notes.slice(noteIndexToUpdate + 1)],
                    filteredNotes: [...currState.notes.slice(0, noteIndexToUpdate), { ...updatedNote }, ...currState.notes.slice(noteIndexToUpdate + 1)]
                }));
            }).catch(error => {
                console.log("Note Service - handleUpdateNote Exception");
            })
    }

    // Filter based on Search string
    filterData = (searchFilter) => {
        const searchString = searchFilter.target.value
        const searchPage =  this.state.currentPage;
        if (searchString) {
            if (searchPage === 'notes') {
                let filteredNotes = this.state.notes.filter(filterNote => filterNote.noteTitle.toLowerCase().indexOf(searchString.toLowerCase()) > -1)
                // set the filetered notes matching given string to the state to show in Notes Container
                this.setState({
                    filteredNotes
                })
            } else if (searchPage === 'cat') {
                let filteredCategories = this.state.categories.filter(filterCategory => filterCategory.categoryName.toLowerCase().indexOf(searchString.toLowerCase()) > -1)
                // set the filetered categories matching given string to the state to show in Categories Container
                this.setState({
                    filteredCategories
                })
            } else if (searchPage === 'rem') {
                let filteredReminders = this.state.reminders.filter(filterReminder => filterReminder.reminderName.toLowerCase().indexOf(searchString.toLowerCase()) > -1)
                // set the filetered notes matching given string to the state to show in Notes Container
                this.setState({
                    filteredReminders
                })
            }         
        } else {
            this.setState(currState => ({
                filteredNotes: currState.notes,
                filteredCategories: currState.categories,
                filteredReminders: currState.reminders,
            }));
        }
    }

    // Reminder Service calls - START
    handleCurrentPage(currentPage) {
        this.setState((currState) => ({
            currentPage: currentPage,
        }));
    }

    getAllReminders() {
        // Get all the Reminders
        let loggedInUser = localStorage.getItem('loggedInUser');
        fetch(`${REMINDER_API_BASE_URL}/${loggedInUser}`)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                else if (response.status === 404) {
                    return Promise.reject(new Error('Invalid URL'))
                }
                else if (response.status === 401) {
                    return Promise.reject(new Error('UnAuthorized User...'));
                }
                else {
                    return Promise.reject(new Error('Some internal error occured...'));
                }
            })
            .then(reminders => this.setState({
                reminders: reminders,
                filteredReminders: reminders
            })).catch(error => {
                console.log("Reminder Service - getAllReminders Exception");
            })
    }

    handleAddReminder(reminder) {
        fetch(`${REMINDER_API_BASE_URL}`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(reminder)
        }).then(response => response.json())
            .then(reminder => {
                this.setState((currState) => ({
                    reminders: currState.reminders.concat([reminder]),
                    filteredReminders: currState.reminders.concat([reminder]),
                }));
            });
    }

    handleRemoveReminder(reminderId) {
        let loggedInUser = localStorage.getItem('loggedInUser');
        fetch(`${REMINDER_API_BASE_URL}/${loggedInUser}/${reminderId}`, {
            method: 'DELETE',
            headers: { "Content-Type": "application/json" }
        })
            //  .then(response => response.json())
            .then(response => {
                const reminderIndexToRemove = this.state.reminders.findIndex(reminder => reminder.reminderId === reminderId);
                this.setState((currState) => ({
                    reminders: [...currState.reminders.slice(0, reminderIndexToRemove), ...currState.reminders.slice(reminderIndexToRemove + 1)],
                    filteredReminders: [...currState.reminders.slice(0, reminderIndexToRemove), ...currState.reminders.slice(reminderIndexToRemove + 1)]
                }));
            });
    }
    // Reminder Service calls - END

    // Delete Service calls - START
    handleDeleteUser() {
        let loggedInUser = localStorage.getItem('loggedInUser');
        fetch(`${USER_API_BASE_URL}/${loggedInUser}`, {
            method: 'DELETE',
            headers: { "Content-Type": "application/json" }
        }).then(user => {
            // since user is deleted, nothing to do. Logout will be called from Header.
            this.setState({ isLoggedIn: false });
        }).catch(error => {
            console.log("User Service - handleDeleteUser Exception");
        });
    }
    // Delete Service calls - END

    // Category Service calls - START
    getAllCategories() {
        // Get all the Categorys
        let loggedInUser = localStorage.getItem('loggedInUser');
        fetch(`${CATEGORY_API_BASE_URL}/${loggedInUser}`)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                else if (response.status === 404) {
                    return Promise.reject(new Error('Invalid URL'))
                }
                else if (response.status === 401) {
                    return Promise.reject(new Error('UnAuthorized User...'));
                }
                else {
                    return Promise.reject(new Error('Some internal error occured...'));
                }
            })
            .then(categories => this.setState({
                categories: categories,
                filteredCategories: categories, 
            })).catch(error => {
                console.log("Category Service - getAllCategories Exception");                
            })
    }

    handleAddCategory(category) {
        fetch(`${CATEGORY_API_BASE_URL}`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(category)
        }).then(response => response.json())
            .then(category => {
                this.setState((currState) => ({
                    categories: currState.categories.concat([category]),
                    filteredCategories: currState.categories.concat([category]) 
                }));
            });
    }

    handleRemoveCategory(categoryId) {
        fetch(`${CATEGORY_API_BASE_URL}/${categoryId}`, {
            method: 'DELETE',
            headers: { "Content-Type": "application/json" }
        })
            //  .then(response => response.json())
            .then(response => {
                const categoryIndexToRemove = this.state.categories.findIndex(category => category.id === categoryId);
                this.setState((currState) => ({
                    categories: [...currState.categories.slice(0, categoryIndexToRemove), ...currState.categories.slice(categoryIndexToRemove + 1)],
                    filteredCategories: [...currState.categories.slice(0, categoryIndexToRemove), ...currState.categories.slice(categoryIndexToRemove + 1)], 
                }));
            });
    }
    // Category Service calls - END

    render() {
        return (
            <Fragment>
                <Router history={history}>
                    <div>
                        <MuiThemeProvider theme={theme}>
                            <Header
                                filterData={this.filterData}
                                isLoggedIn={this.state.isLoggedIn}
                                handleCurrentPage={this.handleCurrentPage}                                
                                handleDeleteUser={this.handleDeleteUser} />                            
                        </MuiThemeProvider>
                        <Switch>
                            <Route
                                path="/"
                                exact
                                render={() => <MuiThemeProvider theme={theme}>
                                    <WelcomePage />
                                </MuiThemeProvider>}
                            />
                            <Route
                                path="/login"
                                exact
                                render={() => <MuiThemeProvider theme={theme}>
                                    <AuthenticationForm handleLogin={this.handleLogin} />
                                </MuiThemeProvider>}
                            />
                            <ProtectedRoute
                                path="/home"
                                exact
                                component={NotesApp}
                                notes={this.state.filteredNotes}
                                handleAddNote={this.handleAddNote}
                                handleRemoveNote={this.handleRemoveNote}
                                currentPage={this.state.currentPage}
                                reminders={this.state.filteredReminders}                                
                                handleAddReminder={this.handleAddReminder}
                                handleRemoveReminder={this.handleRemoveReminder}
                                categories={this.state.filteredCategories}
                                handleAddCategory={this.handleAddCategory}
                                handleRemoveCategory={this.handleRemoveCategory}
                            />
                            <ProtectedRoute
                                path="/edit-note/:id"
                                component={EditNote}
                                notes={this.state.filteredNotes}
                                handleUpdateNote={this.handleUpdateNote}
                            />
                        </Switch>
                    </div>
                </Router>
            </Fragment>
        );
    }
}

export default AppRouter;