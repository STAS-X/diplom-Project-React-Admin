const tokenService = require('../services/token.service');
const { getDoc, doc } = require('firebase/firestore');
const app = require('../app.js');

module.exports = async (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }

  try {
    // Bearer erwerfsdfsdfewrewrwerwerrwesdfsdff
    const token = req.headers.authorization
      ? req.headers.authorization.split(' ')[1]
      : null;

    const isValid = await tokenService.validateAccess(token);

    if (!isValid) {
      return res.status(401).send({
        code: 401,
        name: 'AuthorizationError',
        message: 'Unautorized',
      });
    }
      const firestore = app.firestore;

      const userSnap = await getDoc(doc(firestore, 'auth', 'user'));
      if (userSnap.exists() > 0) {
        const user = userSnap.data();
    	req.userId = user.uid; 
	  }

    next();

  } catch (error) {
    return res.status(401).send({
      code: 401,
      message: `На сервере поризошла ошибка ${error.message}. Попробуйте позже.`,
    });
  }
};
