const express = require('express');
const { nanoid } = require('nanoid');
const { body } = require('express-validator');
const auth = require('../middleware/auth.middlware');
const tokenService = require('../services/token.service');
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

const validations = [
  body('email')
    .if(body('providerId').not().equals('phone'))
    .exists()
    .withMessage('Ошибка валидации: логин (почта) должен быть указан')
    .normalizeEmail()
    .isEmail()
    .withMessage('Ошибка валидации: логин должен быть задан как EMAIL'),
  body('phone')
    .if(body('providerId').equals('phone'))
    .exists()
    .withMessage('Ошибка валидации: логин (телефон) должен быть указан')
    .isMobilePhone()
    .withMessage('Ошибка валидации: логин должен быть задан как PHONE'),
];

router.post('/signIn', [
  validate(validations),
  async (req, res) => {
    try {
      const firestore = app.firestore;

      const { user, token } = req.body;
      let userDB;
      let newId = nanoid();

      const q = query(
        collection(firestore, 'users'),
        where('uid', '==', user.uid),
        limit(1)
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.size === 0) {
        while (doc(firestore, 'auth', newId)) {
          newId = nanoid();
        }

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

      await setDoc(doc(firestore, 'auth', newId), {
        user: { ...user },
        loggedIn: true,
        token: validateToken,
      });

      return res.status(200).send({
        user: userDB,
        token: validateToken,
        authId: newId,
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
      const authId = req.headers.authid ? req.headers.authid : null;

      const userAuthSnap = doc(firestore, 'auth', authId)
        ? await getDoc(doc(firestore, 'auth', authId))
        : null;

      if (userAuthSnap?.exists()) {
        // Обновляем данные авторизации и удаляем объект auth
        await firestore
          .collection('auth')
          .doc(authId)
          .update({ loggedIn: false });
        await firestore.collection('auth').doc(authId).delete();

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
        });
      } else return res.status(500).send({ signOut: false });

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
      const authId = req.headers.authid ? req.headers.authid : null;

      const userAuthSnap = doc(firestore, 'auth', authId)
        ? await getDoc(doc(firestore, 'auth', authId))
        : null;
      let userDB;

      if (!userAuthSnap?.exists()) {
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
      const authId = req.headers.authid ? req.headers.authid : null;

      const isValid = await tokenService.validateRefresh(
        data.oldRefresh,
        authId
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
        .doc(authId)
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
