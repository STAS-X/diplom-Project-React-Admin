const express = require('express');
const User = require('../models/User');
const Token = require('../models/Token');
const { nanoid } = require('nanoid');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth.middlware');
const bcrypt = require('bcryptjs');
const tokenService = require('../services/token.service');
const { generateUserData } = require('../utils/helpers');
const { validate } = require('../utils/validations');
const router = express.Router({ mergeParams: true });
const app = require('../app.js');
const {
  getDoc,
  setDoc,
  query,
  where,
  doc,
  getDocs,
  collection,
} = require('firebase/firestore');
const jwt = require('jsonwebtoken');
const config = require('config');

const validations = [
  body('email')
    .normalizeEmail()
    .isEmail()
    .withMessage('Ошибка валидации: значение email некорректно'),
];

router.post('/signIn', [
  validate(validations),
  async (req, res) => {
    try {
      const firestore = app.firestore;

      // const userSnap = await getDoc(doc(firestore, 'auth', 'user'));
      // const tokenSnap = await getDoc(doc(firestore, 'auth', 'token'));
      // if (userSnap.exists() > 0) {
      //   await firestore.collection('auth').doc('user').delete();
      //   console.log('user delete');
      // }
      // if (tokenSnap.exists() > 0) {
      //   await firestore.collection('auth').doc('token').delete();
      //   console.log('token delete');
      // }
      const { user, token } = req.body;

	  const q = query(
      collection(firestore, 'users'),
      where('uid', '==', user.uid)
     );
	 const querySnapshot = await getDocs(q);
	 if (querySnapshot.size === 0) {
		 const newId = nanoid();
		  await setDoc(
        doc(collection(firestore, 'users'), newId),
        user
      );
	 }

      const colRef = collection(firestore, 'auth');
      await setDoc(doc(colRef, 'user'), {
        ...user,
        loggedIn: true,
      });
      const validateToken = tokenService.generate(token);
      await setDoc(doc(colRef, 'token'), token);

      return res
        .status(200)
        .send({ token: { ...validateToken }, signIn: true });
    } catch (error) {
      return res.status(400).send({
        message: error.message,
        code: 400,
      });
    }
  },
]);

router.get('/authData', [
  auth,
  async (req, res) => {
    try {
      const firestore = app.firestore;

      const tokenSnap = await getDoc(doc(firestore, 'auth', 'token'));
      const userSnap = await getDoc(doc(firestore, 'auth', 'user'));
      let token = null;
      let user = null;
      if (tokenSnap.exists() > 0 && userSnap.exists() > 0) {
        token = tokenSnap.data();
        user = userSnap.data();
      }

      return res.status(200).send({
        token: token ? { ...token } : null,
        user: user ? { ...user } : null,
        signData: true,
      });
    } catch (error) {
      return res.status(400).send({
        message: error.message,
        code: 400,
      });
    }
  },
]);

router.put('/token', [
  auth,
  async (req, res) => {
    try {
      const firestore = app.firestore;
      const { token } = req.body;
      const isValid = tokenService.validateRefresh(token.refreshToken);

      if (!isValid) {
        return res.status(401).send({
          code: 401,
          name: 'AuthorizationError',
          message: 'Unautorized',
        });
      }

      const colRef = collection(firestore, 'auth');
      await setDoc(doc(colRef, 'token'), token);
      const validateToken = tokenService.generate(token);

      res.status(200).send({ token: { ...validateToken }, refresh: true });
    } catch (error) {
      res.status(500).json({
        message: `На сервере произошла ошибка. ${error.message} Попробуйте позже`,
      });
    }
  },
]);

module.exports = router;
