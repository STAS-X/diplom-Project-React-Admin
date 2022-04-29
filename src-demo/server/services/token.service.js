const jwt = require('jsonwebtoken');
const config = require('config');
//const Token = require('../models/Token');
const { getDoc, doc } = require('firebase/firestore');

class TokenService {
  // return accessToken, refreshToken, exporesIn

  generate(payload) {
    const expirationTime = payload.expirationTime;
    const accessToken = jwt.sign(payload, config.get('accessSecret'), {
      expiresIn: '1h',
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
      const tokenSnap = await getDoc(doc(firestore, 'auth', 'token'));
      if (tokenSnap.exists() > 0) {
        const token = tokenSnap.data();
        return (
          token.refreshToken ===
          jwt.verify(refreshToken, config.get('refreshSecret'))
        );
      }
      return false;
    } catch (error) {
      return null;
    }
  }

  async validateAccess(accessToken) {
    try {
      const tokenSnap = await getDoc(doc(firestore, 'auth', 'token'));
      if (tokenSnap.exists() > 0) {
        const token = tokenSnap.data();
        return (
          token.refreshToken ===
          jwt.verify(accessToken, config.get('accessSecret'))
        );
      }
      return false;
	  
    } catch (error) {
      return null;
    }
  }
}

module.exports = new TokenService();
