import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyBNCSbd3kNDBjLvDGfZsvebE7kdCGSltds",
    authDomain: "askscoe-2c873.firebaseapp.com",
    projectId: "askscoe-2c873",
    storageBucket: "askscoe-2c873.appspot.com",
    messagingSenderId: "358068618925",
    appId: "1:358068618925:web:e6bafb70a16ca861176824"
};

  const firebaseApp = firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const provider = new firebase.auth.GoogleAuthProvider();
  const db = firebaseApp.firestore();

  export { auth, provider }
  export default db