const express = require('express');
// const User = require('../models/User');
const auth = require('../middleware/auth.middlware');
const { generateUserData } = require('../utils/helpers');
const router = express.Router({ mergeParams: true });
const app = require('../app.js');

const resource = 'users';

router.get('/:id?', async (req, res) => {
  try {
    const dataProvider = app.provider;
    const query = req.headers['providerrequest'];
    const params = JSON.parse(req.headers['providerparams']);

    console.log(params, query, 'users init');
    const { data } = await dataProvider[query](resource, params);
    res.status(200).send(data);
  } catch (e) {
          console.log(e, 'error users')
    res.status(500).send({
      code: 500,
      name: 'ServerError',
      message: `На сервере произошла ошибка ${e.message}. Попробуйте позже`,
    });
  }
});

router.delete('/:id?', async (req, res) => {
  try {
    const dataProvider = app.provider;
    const query = req.headers['providerrequest'];
    const params = JSON.parse(req.headers['providerparams']);

    const { data } = await dataProvider[query](resource, params);
    res.status(200).send(data);
  } catch (e) {
    res.status(500).send({
      code: 500,
      name: 'ServerError',
      message: `На сервере произошла ошибка ${e.message}. Попробуйте позже`,
    });
  }
});

router.put('/:id?', async (req, res) => {
  try {
    console.log('update user');
    const dataProvider = app.provider;
    const query = req.body.headers.ProviderRequest;
    const params = JSON.parse(req.body.data);

    const { data } = await dataProvider[query](resource, params);
    res.status(200).send(data);
  } catch (e) {
    res.status(500).send({
      code: 500,
      name: 'ServerError',
      message: `На сервере произошла ошибка ${e.message}. Попробуйте позже`,
    });
  }
});

router.post('/', async (req, res) => {
  try {
    console.log('create user');
    const dataProvider = app.provider;
    const query = req.body.headers.ProviderRequest;
    const params = JSON.parse(req.body.data);

    const { data } = await dataProvider[query](resource, params);
    res.status(200).send(data);
  } catch (e) {
    res.status(500).send({
      code: 500,
      name: 'ServerError',
      message: `На сервере произошла ошибка ${e.message}. Попробуйте позже`,
    });
  }
});

module.exports = router;
