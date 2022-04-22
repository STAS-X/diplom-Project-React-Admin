const express = require('express');
// const User = require('../models/User');
// const auth = require('../middleware/auth.middlware');
const { generateUserData } = require('../utils/helpers');
const router = express.Router({ mergeParams: true });

const dataProvider = require('../app').dataProvider;

router.get('/users/:params', async (req, res) => {
  try {
	console.log(req, 'requery data')
	const params = req.params;

	const { data } = await dataProvider[req.queryType]('users', req.params)
	console.log(data, 'data from firebase');

    res.status(200).send(data);
  } catch (e) {
    res.status(500).json({
      message: `На сервере произошла ошибка ${e.message}. Попробуйте позже`,
    });
  }
});

module.exports = router;
