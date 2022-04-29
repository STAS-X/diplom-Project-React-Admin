const express = require('express');
// const User = require('../models/User');
// const auth = require('../middleware/auth.middlware');
const { generateUserData } = require('../utils/helpers');
const router = express.Router({ mergeParams: true });
const app = require('../app.js');

const resource = 'comments';

router.get('/:id?', async (req, res) => {
  try {
    const dataProvider = app.provider;
    const queryType = req.headers['providerquerytype'];
    const params = JSON.parse(req.headers['providerparams']);

    const { data } = await dataProvider[queryType](resource, params);
    res.status(200).send(data);
  } catch (e) {
    console.log(e);
    res.status(500).send({
      error: {
        message: `На сервере произошла ошибка ${e.message}. Попробуйте позже`,
      },
    });
  }
});

router.put('/:id?', async (req, res) => {
  try {
    const dataProvider = app.provider;
    const queryType = req.headers['providerquerytype'];
    const params = JSON.parse(req.headers['providerparams']);

    const { data } = await dataProvider[queryType](resource, params);
    res.status(200).send(data);
  } catch (e) {
    console.log(e);
    res.status(500).send({
      error: {
        message: `На сервере произошла ошибка ${e.message}. Попробуйте позже`,
      },
    });
  }
});

router.post('/', async (req, res) => {
  try {
    console.log('route users');
    const dataProvider = app.provider;
    const queryType = req.headers['providerquerytype'];
    const params = JSON.parse(req.headers['providerparams']);

    const { data } = await dataProvider[queryType](resource, params);
    res.status(200).send(data);
  } catch (e) {
    console.log(e);
    res.status(500).send({
      error: {
        message: `На сервере произошла ошибка ${e.message}. Попробуйте позже`,
      },
    });
  }
});

router.delete('/:id?', async (req, res) => {
  try {
    console.log('route users');
    const dataProvider = app.provider;
    const queryType = req.headers['providerquerytype'];
    const params = JSON.parse(req.headers['providerparams']);

    const { data } = await dataProvider[queryType](resource, params);
    res.status(200).send(data);
  } catch (e) {
    console.log(e);
    res.status(500).send({
      error: {
        message: `На сервере произошла ошибка ${e.message}. Попробуйте позже`,
      },
    });
  }
});

module.exports = router;
