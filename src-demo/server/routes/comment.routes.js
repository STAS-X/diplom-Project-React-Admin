const express = require('express');
// const User = require('../models/User');
const auth = require('../middleware/auth.middlware');
const { generateUserData } = require('../utils/helpers');
const router = express.Router({ mergeParams: true });
const app = require('../app.js');

const resource = 'comments';

router.get('/:id?', [
  auth,
  async (req, res) => {
    try {
      const dataProvider = app.provider;
      const queryType = req.headers['providerrequest'];
      const params = JSON.parse(req.headers['providerparams']);

      const { data } = await dataProvider[queryType](resource, params);
      res.status(200).send(data);
    } catch (e) {
      res.status(500).send({
        error: {
          message: `На сервере произошла ошибка ${e.message}. Попробуйте позже`,
        },
      });
    }
  },
]);

router.put('/:id?', [
  auth,
  async (req, res) => {
    try {
      const dataProvider = app.provider;
      const queryType = req.headers['providerrequest'];
      const params = JSON.parse(req.headers['providerparams']);

      const { data } = await dataProvider[queryType](resource, params);
      res.status(200).send(data);
    } catch (e) {
      res.status(500).send({
        error: {
          message: `На сервере произошла ошибка ${e.message}. Попробуйте позже`,
        },
      });
    }
  },
]);

router.post('/', [
  auth,
  async (req, res) => {
    try {
      console.log('route comments');
      const dataProvider = app.provider;
      const queryType = req.headers['providerrequest'];
      const params = JSON.parse(req.headers['providerparams']);

      const { data } = await dataProvider[queryType](resource, params);
      res.status(200).send(data);
    } catch (e) {
      res.status(500).send({
        error: {
          message: `На сервере произошла ошибка ${e.message}. Попробуйте позже`,
        },
      });
    }
  },
]);

router.delete('/:id?', [
  auth,
  async (req, res) => {
    try {
      console.log('route comments');
      const dataProvider = app.provider;
      const queryType = req.headers['providerrequest'];
      const params = JSON.parse(req.headers['providerparams']);

      const { data } = await dataProvider[queryType](resource, params);
      res.status(200).send(data);
    } catch (e) {
      res.status(500).send({
        error: {
          message: `На сервере произошла ошибка ${e.message}. Попробуйте позже`,
        },
      });
    }
  },
]);

module.exports = router;
