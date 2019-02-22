import firebase from "firebase";
// import { createStore, combineReducers, compose } from "redux";
// import "firebase/firestore";
// import { reactReduxFirebase, firebaseReducer } from "react-redux-firebase";
// import { reduxFirestore, firestoreReducer } from "redux-firestore";

//Firebase Config

const FirebaseConfig = {
  apiKey: "AIzaSyC2grZB2UqRlAqN2lFLlJCIPcHuvRXLsis",
  authDomain: "ckbookstore-b19c7.firebaseapp.com",
  databaseURL: "https://ckbookstore-b19c7.firebaseio.com",
  projectId: "ckbookstore-b19c7",
  storageBucket: "ckbookstore-b19c7.appspot.com",
  messagingSenderId: "303678284526"
};

// react-redux-firebase config
// const rrfConfig = {
//   userProfile: "users",
//   useFirestoreForProfile: true
// };

//   Init FireBase Instance

const app = firebase.initializeApp(FirebaseConfig);

// Initialize other services on firebase instance
const db = firebase.firestore(app);

// // Add reactReduxFirebase enhancer when making store creator
// const createStoreWithFirebase = compose(
//   reactReduxFirebase(firebase, rrfConfig),
//   reduxFirestore(firebase)
// )(createStore);

// Add firebase to reducers
// const rootReducer = combineReducers({
//   firebase: firebaseReducer,
//   firestore: firestoreReducer
// });

// Create store with reducers and initial state
// const initialState = {};
// const store = createStoreWithFirebase(
//   rootReducer,
//   initialState,
//   compose(
//     reactReduxFirebase(firebase),
//     window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
//   )
// );

 export default db;