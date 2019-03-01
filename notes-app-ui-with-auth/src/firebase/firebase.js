import * as firebase from 'firebase';

// Initialize Firebase
const config = {
    apiKey: "AIzaSyCVvNENvu87DEpbqPJek5i-UEBFTThFK-Y",
    authDomain: "notes-app-ravi.firebaseapp.com",
    databaseURL: "https://notes-app-ravi.firebaseio.com",
    projectId: "notes-app-ravi",
    storageBucket: "notes-app-ravi.appspot.com",
    messagingSenderId: "298987751061"
  };
  firebase.initializeApp(config);

  const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

  export {firebase, googleAuthProvider};