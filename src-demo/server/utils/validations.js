const { validationResult } = require('express-validator');

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
};
