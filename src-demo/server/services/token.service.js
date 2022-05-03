const jwt = require('jsonwebtoken');
const config = require('config');
//const Token = require('../models/Token');
const { getDoc, doc } = require('firebase/firestore');
const app = require('../app.js');

class TokenService {
  // return accessToken, refreshToken, exporesIn

  generate(payload) {
    const expirationTime = payload.expirationTime;
    const accessToken = jwt.sign(payload, config.get('accessSecret'), {
      expiresIn: 3600,
    });

    const refreshToken = jwt.sign(payload, config.get('refreshSecret'));

    return {
      accessToken,
      refreshToken,
      expirationTime,
    };
  }

  // async save(userId, refreshToken) {
  // 	const data = await Token.findOne({ userId });

  // 	if (data) {
  // 		data.refreshToken = refreshToken;
  // 		return await data.save();
  // 	}
  // 	const token = await Token.create({
  // 		userId,
  // 		refreshToken,
  // 	});
  // 	return token;
  // }

  async validateRefresh(refreshToken) {
    try {
      const firestore = app.firestore;
      const tokenSnap = await getDoc(doc(firestore, 'auth', 'token'));
      if (tokenSnap.exists() > 0) {
        const token= tokenSnap.data();

        return (
          jwt.verify(refreshToken, config.get('refreshSecret')).refreshToken ===
          jwt.verify(token.refreshToken, config.get('refreshSecret'))
            .refreshToken
        );
      }
      return false;
    } catch (error) {
      return null;
    }
  }

  async validateAccess(accessToken) {
    try {
      const firestore = app.firestore;
      const tokenSnap = await getDoc(doc(firestore, 'auth', 'token'));

      if (tokenSnap.exists() > 0) {
        const token = tokenSnap.data();

        return (
          jwt.verify(accessToken, config.get('accessSecret')).accessToken ===
          jwt.verify(token.accessToken, config.get('accessSecret')).accessToken
        );
      }
      return false;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

module.exports = new TokenService();
