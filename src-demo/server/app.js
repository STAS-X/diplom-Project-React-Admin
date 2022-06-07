const express = require('express');
// const https = require('https');
const config = require('config');
const chalk = require('chalk');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const routes = require('./routes');

const firebase = require('firebase/compat/app');
require('firebase/compat/auth');
require('firebase/compat/firestore');
require('firebase/compat/storage');
const { FirebaseDataProvider } = require('react-admin-firebase');

firebase.initializeApp(config.firebaseConfig);
const { doc, collection, getDoc, setDoc } = require('firebase/firestore');

const dataProvider = FirebaseDataProvider(config.firebaseConfig, {
  logging: true,
  //rootRef: 'rootrefcollection/QQG2McwjR2Bohi9OwQzP',
  app: firebase,
  // watch: ['posts'];
  // dontwatch: ['comments'];
  persistence: 'local',
  disableMeta: true,
  dontAddIdFieldToDoc: false,
  lazyLoading: {
    enabled: false,
  },
  renameMetaFields: {
    created_at: 'createdAt',
    created_by: false,
    updated_at: 'updatedAt',
    updated_by: false,
  },
  useFileNamesInStorage: false,
  firestoreCostsLogger: {
    enabled: false,
  },
});

const signWithEmail = async () => {
  await firebase
    .auth()
    .signInWithEmailAndPassword(
      config.get('firebaseConfig').email,
      config.get('firebaseConfig').password
    )
    .then((user) => {
      console.log(chalk.green('Backend login DB success'));
      module.exports.provider = dataProvider;
      module.exports.firestore = firebase.firestore();
      module.exports.firebase = firebase;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(chalk.red(errorMessage));
      process.exit(1);
    });
};

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

app.use('/api', routes);

const PORT = config.get('port') || 3000;
const PORT_PROD = config.get('portProd') || 3000;

if (process.env.NODE_ENV === 'production') {
  console.log(chalk.red('This is production mode'));
  app.use('/', express.static(path.join(__dirname, 'client')));

  const indexPath = path.join(__dirname, 'client', 'index.html');
  app.get('*', (req, res) => {
    res.sendFile(indexPath);
  });
} else console.log(chalk.blue('This is development mode'));

app.listen(PORT, () => {
  signWithEmail();
  console.log(chalk.green(`Server has been starte on ${PORT} port`));
});
