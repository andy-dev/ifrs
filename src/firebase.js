import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import { navigate } from "@reach/router";

const firebaseConfig = {
  apiKey: "AIzaSyCBrT4Rd3wlLFxaP2XTrMNo3fRsFDbRrs4",
  authDomain: "ifrs-2c2b4.firebaseapp.com",
  databaseURL: "https://ifrs-2c2b4.firebaseio.com",
  projectId: "ifrs-2c2b4",
  storageBucket: "ifrs-2c2b4.appspot.com",
  messagingSenderId: "1076037163051",
  appId: "1:1076037163051:web:55396d15b3b4919e4df26e",
  measurementId: "G-EEEG45ZFBT"
};

firebase.initializeApp(firebaseConfig);
export const firestore = firebase.firestore();
export const auth = firebase.auth();

export const signOut = () => {
  auth.signOut();
  navigate(`/`);
};

// the user we pass is the user we get back from the auth module
// with google we get display out of the box
// with email, we pass add data to get that display name
export const createUserProfileDocument = async (user, additionalData) => {
  // auth change, when they sign out, that is null
  // we are going to run this function on every sing in and sign out
  // when we sign out the user will be null, so do nothing
  if (!user) return;

  // we find a ref to the place in the database
  const userRef = firestore.doc(`users/${user.uid}`);
  // fetch doc from location
  const snapshot = await userRef.get();

  // if we do not have a snapshot, then we create one
  if (!snapshot.exists) {
    const createdAt = new Date();
    const { displayName, email, photoURL } = user;
    try {
      await userRef.set({
        displayName,
        email,
        photoURL,
        createdAt,
        ...additionalData
      });
    } catch (err) {
      console.error("Error creating user", err.message);
    }
  }
  // get it after we create the user
  return getUserDocument(user.uid);
};

export const getUserDocument = async uid => {
  if (!uid) return null;

  // try and get it out of the db
  try {
    // const userDocument = await firestore.collection('users').doc(uid).get();
    // return just the place in the db, the ref
    return firestore.collection("users").doc(uid);
  } catch (err) {
    console.error("Error getting user doc", err.message);
  }
};

export const provider = new firebase.auth.GoogleAuthProvider();
export const signInWithGoogle = () => auth.signInWithPopup(provider);
export default firebase;
