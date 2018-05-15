// Import the Firebase modules that you need in your app.
import firebase from 'firebase/app'
import 'firebase/database'

// Initalize and export Firebase.
const config = {
  apiKey: 'AIzaSyAhUU7rhVChm7xKA1I9INNZfpQPOQ6vXT0',
  authDomain: 'metre-79ac4.firebaseapp.com',
  databaseURL: 'https://metre-79ac4.firebaseio.com',
  projectId: 'metre-79ac4',
  storageBucket: 'metre-79ac4.appspot.com',
  messagingSenderId: '875144263060'
}
export default firebase.initializeApp(config)
