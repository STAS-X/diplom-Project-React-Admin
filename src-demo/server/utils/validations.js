const { validationResult, body } = require('express-validator');

const commentValidations = [
  body('description')
    .exists()
    .withMessage('Ошибка валидации: значение Заголовка должно быть указано')
    .isLength({ min:3, max: 30 })
    .withMessage(
      'Ошибка валидации: значение Заголовка должно быть не более 30 символов'
    ),
  body('body')
    .exists()
    .withMessage('Ошибка валидации: комментарий должен быть указан')
    .isLength({ min: 5 })
    .withMessage(
      'Ошибка валидации: минимальное количество символов в комментария - 5'
    ),
];

const taskValidations = [
  body('title')
    .exists()
    .withMessage('Ошибка валидации: значение Заголовка должно быть указано')
    .isLength({ min: 3, max: 30 })
    .withMessage(
      'Ошибка валидации: значение Заголовка должно быть не более 30 символов'
    ),
  body('executeAt')
    .exists()
    .withMessage('Ошибка валидации: задача должна иметь дату исполнения')
    .isDate()
    .withMessage('Ошибка валидации: значение executeAt должно быть датой'),
  body('executors')
    .isArray({ min: 1 })
    .withMessage('Ошибка валидации: исполнители должны быть указаны'),
  body('progress')
    .exists()
    .withMessage('Ошибка валидации: прогресс выполнения должен быть указан')
    .isInt({ min: 0, max: 100 })
    .withMessage('Ошибка валидации: прогресс должен иметь значения 0-100'),
  body('status')
    .exists()
    .withMessage('Ошибка валидации: статус задачи должен присутствовать')
    .isBoolean()
    .withMessage('Ошибка валидации: статус задачи должен иметь булево значение ИСТИНА/ЛОЖЬ'),
];

const userValidations = [
  body('name')
    .exists()
    .withMessage('Ошибка валидации: имя пользователя должно быть указано')
    .isLength({ min: 3 })
    .withMessage('Ошибка валидации: имя должно быть не менее 3-х символов '),
  body('age')
    .isInt({ min: 10, max: 100 })
    .withMessage(
      'Ошибка валидации: значение возраста должно быть в пределах 10-100'
    ),
  body('uid')
    .exists()
    .withMessage('Ошибка валидации: значение UID должно присутствовать'),
  body('email')
    .exists()
    .withMessage('Ошибка валидации: логин должен быть указан')
    .isEmail()
    .withMessage('Ошибка валидации: логин должен быть задан как EMAIL'),
];


const validate = (validations) => {
  return async (req, res, next) => {
    const body = {
      body: {
        ...(req.body.data
          ? JSON.parse(req.body.data).data
          : req.body.user?req.body.user:req.body),
      },
    };

    for (let validation of validations) {
      const result = await validation.run(body);
      if (result.errors.length) break;
    }

    const errors = validationResult(body);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).send({
        code: 400,
        name: 'ValidationError',
        message: errors.errors[0].msg,
        errors: errors.array(),
    });
  };
};

module.exports = {
  validate,
  commentValidations,
  taskValidations,
  userValidations,
};
