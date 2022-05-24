const tokenService = require('../services/token.service');
const { getDoc, doc } = require('firebase/firestore');
const app = require('../app.js');

module.exports = async (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }

  try {
    // Проверяем истечение сроков токена для backend подключения и если они истекли обновляем токен
    const firebaseApp = app.firebase;
    if (firebaseApp) {
      const authUser = await firebaseApp.auth().currentUser;
      const authToken = await authUser.getIdTokenResult();

      //console.log(authToken.expirationTime, 'Дата истечения токена');
      if (Date(authToken.expirationTime) < Date.now()) {
        const newAuthToken = await authUser.getIdToken(true);
        console.log('Получен новый токен ', newAuthToken);
      }
    }

    // Bearer erwerfsdfsdfewrewrwerwerrwesdfsdff
    const token = req.headers.authorization
      ? req.headers.authorization.split(' ')[1]
      : null;
    const userUid=req.headers.useruid?req.headers.useruid:null

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
      //req.userId = user.uid;
      if (req.method === 'PUT' || req.method === 'DELETE') {
        const { data }  = req.body.data?JSON.parse(req.body.data):{data:null};

        if (data || userUid) {
          console.log(data,user.uid,userUid,'get permissions')
          const dataUid = data?.uid?data.uid:data?.id?data.id:null;
          if (!(dataUid && dataUid === user.uid || userUid && userUid === user.uid)) {
            return res.status(403).send({
              code: 403,
              name: 'PermissionError',
              description:
                'Обновление или удаление данных доступно только для владельца',
              message: 'PermissionDenied',
            });
          }
        }
      }
    }

    next();
  } catch (error) {
    console.log(error, 'error trying');
    return res.status(400).send({
      code: 400,
      message: `На сервере поризошла ошибка ${error.message}. Попробуйте позже.`,
    });
  }
};
