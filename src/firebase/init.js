import firebase from 'firebase'
import firestore from 'firebase/firestore'

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAzm80JoAwOdAQyUQfhIEQ-JERXKOBpLTY",
    authDomain: "orienteering-event.firebaseapp.com",
    databaseURL: "https://orienteering-event.firebaseio.com",
    projectId: "orienteering-event",
    storageBucket: "orienteering-event.appspot.com",
    messagingSenderId: "573177130176"
    };
    
    const firebaseApp = firebase.initializeApp(config);
    firebaseApp.firestore().settings({timestampsInSnapshots: true})
    
    // export firestore database
    export default firebaseApp.firestore()
