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

// authProvider.checkError = (error) => {
//         const status = error.status;
//         if (status === 401 || status === 403) {
//             return Promise.reject({
//                 redirectTo: '/login',
//                 logoutUser: false,
//             });
//         }
//         // other error code (404, 500, etc): no need to log out
//         return Promise.resolve();
//     };
// authProvider.checkAuth = (params) => {
//   console.log(params, 'Параметры')
//   // let's say user is not logged in
//   return Promise.reject({
//     redirectTo: 'https://localhost:3333/#/login',
//   });
// };
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
