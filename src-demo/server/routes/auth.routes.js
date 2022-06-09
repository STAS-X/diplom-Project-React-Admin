const express = require('express');
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

      const { user, token } = req.body;
      let userDB;

      const q = query(
        collection(firestore, 'users'),
        where('uid', '==', user.uid),
        limit(1)
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.size === 0) {
        //const newId = nanoid();
        await setDoc(doc(firestore, 'users', user.uid), {
          ...user,
          createdAt: Date.now(),
          id: user.uid,
        });
        userDB = {
          ...user,
          createdAt: Date.now(),
          id: user.uid,
        };
      } else {
        querySnapshot.forEach((doc) => {
          userDB = doc.data();
        });
      }

      const validateToken = tokenService.generate(token);

      await setDoc(doc(firestore, 'auth', user.uid), {
        user: { ...user, loggedIn: true },
        token: validateToken,
      });

      return res.status(200).send({
        user: userDB,
        token: validateToken,
        signIn: true,
      });
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

      const userUid = req.headers.useruid ? req.headers.useruid : null;

      const userAuthSnap = await getDoc(doc(firestore, 'auth', userUid));
      if (userAuthSnap.exists()) {
        // Меняем поле даты последнего входа
        const q = query(
          collection(firestore, 'users'),
          where('uid', '==', userUid),
          limit(1)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (doc) => {
          await firestore
            .collection('users')
            .doc(doc.id)
            .update({ lastLogOut: Date.now() });
          await firestore.collection('auth').doc(userUid).update({ user: { loggedIn: false } });
          await firestore.collection('auth').doc(userUid).delete();
        });

      }
      return res.status(200).send({ signOut: true });
    } catch (error) {
      console.info(error, 'get error from signOut');
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

      const userUid = req.headers.useruid ? req.headers.useruid : null;
      const userAuthSnap = await getDoc(doc(firestore, 'auth', userUid));
      let userDB;

      if (!userAuthSnap.exists()) {
        return res.status(500).send({
          token: null,
          user: null,
          signData: false,
        });
      }

      const { token } = userAuthSnap.data();
      const q = query(
        collection(firestore, 'users'),
        where('uid', '==', userUid),
        limit(1)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        userDB = doc.data();
      });
      //console.log(tokenSnap.data(), userSnap.data(), 'from db');

      return res.status(200).send({
        token,
        user: userDB,
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
  async (req, res) => {
    try {
      const firestore = app.firestore;
      const { data } = req.body;
      const userUid = req.headers.useruid ? req.headers.useruid : null;
      const isValid = await tokenService.validateRefresh(
        data.oldRefresh,
        userUid
      );

      if (!isValid) {
        return res.status(401).send({
          code: 401,
          name: 'AuthorizationError',
          message: 'Unautorized',
        });
      }
      delete data.oldRefresh;

      const validateToken = tokenService.generate(data);
      await firestore
        .collection('auth')
        .doc(userUid)
        .update({ token: validateToken });

      res.status(200).send({ token: validateToken, refresh: true });
    } catch (error) {
      res.status(400).send({
        code: 400,
        message: error.message,
      });
    }
  },
]);

module.exports = router;
