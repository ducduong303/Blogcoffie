import firebase from "firebase";
const firebaseConfig = firebase.initializeApp({
    apiKey: "AIzaSyDS6RkF31DZHqhBTkhR3m7XVlmY7NcFFTk",
    authDomain: "blogcoffie.firebaseapp.com",
    databaseURL: "https://blogcoffie.firebaseio.com",
    projectId: "blogcoffie",
    storageBucket: "blogcoffie.appspot.com",
    messagingSenderId: "561993690650",
    appId: "1:561993690650:web:72e7bbed4357765ac82ba3",
    measurementId: "G-4Z27S3B4SD"
})

const auth = firebase.auth();
const db = firebaseConfig.firestore();
const storage = firebase.storage();


export { auth, db, storage };