const express = require('express');
// const User = require('../models/User');
const auth = require('../middleware/auth.middlware');
const { generateUserData } = require('../utils/helpers');
// Add validation to create and update object
const { validate } = require('../utils/validations');
const { validationResult, body } = require('express-validator');

const router = express.Router({ mergeParams: true });
const app = require('../app.js');

const resource = 'posts';
const validations = [
	body('title')
		.exists()
		.withMessage('Ошибка валидации: значение title должно быть указано')
		.isLength({ max: 6 })
		.withMessage(
			'Ошибка валидации: значение title должно быть более 6 символов'
		),
	body('body')
		.exists()
		.withMessage('Ошибка валидации: значение body должно быть указано')
		.isLength({ min: 10 })
		.withMessage(
			'Ошибка валидации: минимальное количество символов в body - 10'
		),
];

router.get('/:id?', [
	auth,
	async (req, res) => {
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
	},
]);

router.delete('/:id?', [
	auth,
	async (req, res) => {
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
	},
]);

router.put('/:id?', [
	auth,
	validate(validations),
	async (req, res) => {
		try {
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
	},
]);

router.post('/', [
	auth,
	validate(validations),
	async (req, res) => {
		try {
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
	},
]);

module.exports = router;
