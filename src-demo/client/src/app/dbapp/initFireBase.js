import {
  /* FirebaseDataProvider, */
  FirebaseAuthProvider,
} from 'react-admin-firebase';

import appConfig from '../config/default.json';

import firebase from 'firebase/compat/app';
import simpleDataProvider from '../services/simple.data.Provider';

export const firebaseApp = firebase.initializeApp(appConfig.firebaseConfig);

export const authProvider = FirebaseAuthProvider(appConfig.firebaseConfig, {
  app: firebaseApp,
});

export const dataProvider = simpleDataProvider;
