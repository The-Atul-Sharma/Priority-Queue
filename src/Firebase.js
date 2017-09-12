import * as firebase from 'firebase';

// Initialize Firebase
var config = {
    apiKey: "AIzaSyAFtnCMwVcG-ki9IihApDBPJzxMraxa1dg",
    authDomain: "todo-ccaca.firebaseapp.com",
    databaseURL: "https://todo-ccaca.firebaseio.com",
    projectId: "todo-ccaca",
    storageBucket: "todo-ccaca.appspot.com",
    messagingSenderId: "401266856338"
};
export const firebaseApp = firebase.initializeApp(config);
export const users = firebaseApp.database().ref().child('users');
export const usersWishlist = firebaseApp.database().ref().child('usersWishlist');
export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
