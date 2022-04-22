import {
  FirebaseDataProvider,
  FirebaseAuthProvider,
} from 'react-admin-firebase';

import firebaseConfig from './FIREBASE_CONFIG.json';

import firebase from 'firebase/compat/app';

const firebaseApp = firebase.initializeApp(firebaseConfig);

export const dataProvider = FirebaseDataProvider(firebaseConfig, {
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
