import {
  /* FirebaseDataProvider, */
  FirebaseAuthProvider,
} from 'react-admin-firebase';

import appConfig from '../config/default.json';

import firebase from 'firebase/compat/app';
import simpleDataProvider from '../services/simple.data.Provider';

const firebaseApp = firebase.initializeApp(appConfig.firebaseConfig);

export const authProvider = FirebaseAuthProvider(appConfig.firebaseConfig);
export const dataProvider = simpleDataProvider;
/*
export const dataProvider = FirebaseDataProvider(appConfig.firebaseConfig, {
  logging: true,
  //rootRef: 'rootrefcollection/QQG2McwjR2Bohi9OwQzP',
  app: firebaseApp,
  // watch: ['posts'];
  // dontwatch: ['comments'];
  persistence: 'storage',
  disableMeta: false,
  dontAddIdFieldToDoc: false,
  lazyLoading: {
    enabled: true,
  },
  firestoreCostsLogger: {
    enabled: true,
  },
});
*/
