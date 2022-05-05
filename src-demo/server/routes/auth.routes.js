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
  limit,
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

      let userDB = user;
      const q = query(
        collection(firestore, 'users'),
        where('uid', '==', user.uid),
        limit(1)
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.size === 0) {
        const newId = nanoid();
        await setDoc(doc(collection(firestore, 'users'), newId), {
          ...user,
          id: newId,
        });
      } else {
        querySnapshot.forEach(async (doc) => {
          userDB = doc.data();
        });
      }

      const colRef = collection(firestore, 'auth');
      await setDoc(doc(colRef, 'user'), {
        ...user,
        loggedIn: true,
      });

      const validateToken = tokenService.generate(token);
      await setDoc(doc(colRef, 'token'), validateToken);

      return res
        .status(200)
        .send({ token: { ...validateToken }, user: userDB, signIn: true });
    } catch (error) {
      return res.status(400).send({
        code: 400,
        message: error.message,
      });
    }
  },
]);
router.delete('/signOut', [
  auth,
  async (req, res) => {
    try {
      const firestore = app.firestore;

      const userSnap = await getDoc(doc(firestore, 'auth', 'user'));
      const tokenSnap = await getDoc(doc(firestore, 'auth', 'token'));
      if (userSnap.exists() && tokenSnap.exists()) {
        const { uid } = userSnap.data();
        // Меняем поле даты последнего входа
        const q = query(
          collection(firestore, 'users'),
          where('uid', '==', uid),
          limit(1)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (doc) => {
          const id = doc.id;
          await firestore
            .collection('users')
            .doc(id)
            .update({ lastLogOut: Date.now() });
        });

        await firestore.collection('auth').doc('user').delete();
        await firestore.collection('auth').doc('token').delete();
        //console.log('user and token delete');
      }
      return res.status(200).send({ signOut: true });
    } catch (error) {
      return res.status(400).send({
        code: 400,
        message: error.message,
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

      if (tokenSnap.exists() && userSnap.exists()) {
        token = tokenSnap.data();
        user = userSnap.data();
        const q = query(
          collection(firestore, 'users'),
          where('uid', '==', user.uid),
          limit(1)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (doc) => {
            user = doc.data();
            console.log(user, 'get auth data from firestore')
          });
        }
      //console.log(tokenSnap.data(), userSnap.data(), 'from db');

      return res.status(200).send({
        token: token ? { ...token } : null,
        user: user ? { ...user } : null,
        signData: true,
      });
    } catch (error) {
      return res.status(400).send({
        code: 400,
        message: error.message,
      });
    }
  },
]);

router.put('/token', [
  auth,
  async (req, res) => {
    try {
      const firestore = app.firestore;
      const { data } = req.body;

      const isValid = await tokenService.validateRefresh(data.oldRefresh);

      if (!isValid) {
        return res.status(401).send({
          code: 401,
          name: 'AuthorizationError',
          message: 'Unautorized',
        });
      }

      const colRef = collection(firestore, 'auth');
      const validateToken = tokenService.generate(data);
      await setDoc(doc(colRef, 'token'), validateToken);

      res.status(200).send({ token: { ...validateToken }, refresh: true });
    } catch (error) {
      res.status(400).send({
        code: 400,
        message: error.message,
      });
    }
  },
]);

module.exports = router;
