const express = require('express');
// const https = require('https');
const config = require('config');
const chalk = require('chalk');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const routes = require('./routes');

//import * as functions from 'firebase-functions';
const fireCreditial = require('./config/fireBaseCreditial.json');
const firebaseConfig = require('./config/default.json');
const auth = require('firebase/auth');
const { signOut } = require('firebase/auth');
const firebase = require('firebase/app');
const { initializeApp } = require('firebase/app');
const {
  getDatabase,
  ref,
  get,
  child,
  set,
  onValue,
} = require('firebase/database');
const {
  getFirestore,
  collection,
  getDoc,
  getDocs,
  doc,
} = require('firebase/firestore');

const firebaseApp = initializeApp(config.firebaseConfig);

const signEmail = async () => {
  await auth
    .signInWithEmailAndPassword(
      auth.getAuth(firebaseApp),
      'backenduserfirebase@firebase.com',
      'qQ123456'
    )
    .then(async (user) => {
      console.log(user, 'Backend loggin DB success');
      const store = getFirestore(firebaseApp);
      const snapshot = await getDoc(doc(store, 'users', '1'));
      console.log(snapshot.data());
      // firebaseApp
      //   .ref('users/' + 'uBWEBkD6vePYJEl4lvbLZuGVhCb2')
      //   .once('value', (snap) => {
      //     console.log(snap.val());
      //   });
    });
};
signEmail();
  // const getdoc = async () => {
//         const store = getFirestore(firebaseApp);
//         const snapshot = await getDoc(doc(store, 'users', '1'));
//         console.log(snapshot.data());
// }
// getdoc();
// signOut(auth).then(async () => {
//       console.log(user,'Backend loggout DB success');
//       const store = getFirestore(firebaseApp);
//       const snapshot = await getDoc(doc(store, 'users', '1'));
//       console.log(snapshot.data());
// })

//       const store = getFirestore(firebaseApp);
//       //const firestore = getFirestore();
// const getMarker = async () => {
//     const snapshot = await collection(store, 'users').get();
//     return snapshot.docs.map(doc => doc.data());
// }
// console.log(getMarker());

//console.log(store);

// store
//   .collection('paintings')
//   .orderBy('createdAt', 'desc').then((doc) => console.log(doc));

// const docSnap = async () => {
//   const docs = await getDocs(collection(store, 'users'));
//   docs.forEach((doc) => {
//     console.log(doc.id, " => ", doc.data());
//   });
// };
// docSnap();

//.then((snap) => console.log(snap.data()));

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use('/api', routes);

const PORT = config.get('port') || 3333;
const PORT_PROD = config.get('portProd') || 3333;
// Creating object of key and certificate
// for SSL
// const options = {
//	key: fs.readFileSync(path.join(__dirname, 'config', 'server.key')),
//	cert: fs.readFileSync(path.join(__dirname, 'config', 'server.cert')),
// };

if (process.env.NODE_ENV === 'production') {
  console.log(chalk.red('This is production mode'));
  app.use('/', express.static(path.join(__dirname, 'client')));

  const indexPath = path.join(__dirname, 'client', 'index.html');
  app.get('*', (req, res) => {
    res.sendFile(indexPath);
  });
} else console.log(chalk.blue('This is development mode'));

app.listen(PORT, () =>
  console.log(chalk.green(`Server has been starte on ${PORT} port`))
);

// ('backenduserfirebase@firebase.com', 'qQ123456')
// .then((user) => console.log(user, 'Backend loggin DB success'));

//const authEmail = new auth(firebaseApp);
// const auth = require('firebase/auth').getAuth;
// const signInWithCustomToken = require('firebase/auth');

//  const customToken = async () => {
//    return await firebaseApp.auth().createCustomToken(fireCreditial.uid);
//  };

// authEmail
//   .signInWithEmailAndPassword('backenduserfirebase@firebase.com', 'qQ123456')
//   .then((user) => console.log(user, 'Backend loggin DB success'))
//   .catch((error) => {
//     const errorCode = error.code;
//     const errorMessage = error.message;
//     console.log(chalk.red(errorMessage));
//     process.exit(1);
//     // ...
//   });

//console.log(firebase.auth(), authEmail);

// const printUsers = async () => {
//   const userCollection = 'posts';
//   console.log(
//     chalk.green(`Initialize db FireBase success. Now we get users collection`)
//   );
//   const userQuerySnapshot = await db.collection(userCollection).get();
//   userQuerySnapshot.forEach((doc) => console.log(doc));
//   console.log(chalk.blue(`We find ${userQuerySnapshot.length} users in DB`));
// };

// printUsers();
