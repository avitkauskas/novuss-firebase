// Copy config from your Firebase account
// and rename this file to firebase.js

import Firebase from 'firebase'

const config = {
    apiKey: "YourAPIKey",
    authDomain: "your-firebase.firebaseapp.com",
    databaseURL: "https://your-firebase.firebaseio.com",
    projectId: "your-firebase",
    storageBucket: "your-firebase.appspot.com",
    messagingSenderId: "YourSenderId"
};

let app = Firebase.initializeApp(config);
let db = app.database();

export default db;