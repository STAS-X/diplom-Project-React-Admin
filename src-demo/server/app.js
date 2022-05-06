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
  disableMeta: false,
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

// const loginValidation = {
//   body: Joi.object({
//     email: Joi.string().email().required(),
//     password: Joi.string()
//       .regex(/[a-zA-Z0-9]{3,30}/)
//       .required(),
//   }),
// };

// // parallel processing
// const validate = validations => {
//   return async (req, res, next) => {
//     await Promise.all(validations.map(validation => validation.run(req)));

//     const errors = validationResult(req);
//     if (errors.isEmpty()) {
//       return next();
//     }

//     res.status(400).json({ errors: errors.array() });
//   };
// };

// app.get(
//   '/api/users/',
//   (req, res, next) => {
//     //console.log(req.headers['providerparams']);
//     // if (typeof req.body === 'object') {
//     //   const data = { email: 'test', password: 'qqqwQweR123454' }; //JSON.parse(req.headers['providerparams']);
//     //   req.body = data || {};
//     // }
//     req.body = { email: 'testtest.ru', password: 'qqqwQweR123454' };
//     next();
//   },
//   validate([
//     body('email')
//       .isEmail()
//       .withMessage(
//         'Ошибка валидации: значение должно быть в формате email'
//       ),
//     body('password')
//       .isLength({ min: 6 })
//       .withMessage(
//         'Ошибка валидации: минимальное количество символов в пароле - 6'
//       ),
//   ]),
// );

// app.use(function (err, req, res, next) {
//   if (err) {
//     console.log(err);
//     return res.status(err.statusCode).send({
//       error: {
//         status: err.statusCode,
//         name: err.name,
//         message: err.details ? err.details.body.message : err.message,
//         error: err.error,
//       },
//     });
//   }

//   return res.status(500).send({
//     error: {
//       status: err.statusCode,
//       name: err.name,
//       message: err.message,
//       error: err.details ? err.details.body.message : err.message,
//     },
//   });
// });

app.use('/api', routes);

const PORT = config.get('port') || 3333;
const PORT_PROD = config.get('portProd') || 3333;

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

// module.exports = async () => {
//   const isLogIn = await signWithEmail();
//   if (isLogIn) return (module.exports = dataProvider);
// };
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
