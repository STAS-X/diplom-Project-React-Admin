const jwt = require('jsonwebtoken');
const config = require('config');
const { getDoc, doc } = require('firebase/firestore');

class TokenService {
  // return accessToken, refreshToken, exporesIn
  #firestore;
  app;

  generate(payload) {
    this.app = require('../app.js');
    this.#firestore = this.app.firestore;

    const currentTime = new Date();
    currentTime.setHours(currentTime.getHours() + 1);
    const expirationTime = currentTime.getTime();

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

  async validateRefresh(refreshToken, uid) {
    try {

      const tokenSnap = doc(this.#firestore, 'auth', uid)?await getDoc(doc(this.#firestore, 'auth', uid)):null;

      if (tokenSnap?.exists()) {
        const { token } = tokenSnap.data();

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

  async validateAccess(accessToken, uid) {
    try {
      const tokenSnap = doc(this.#firestore, 'auth', uid)?await getDoc(doc(this.#firestore, 'auth', uid)):null;

      if (tokenSnap?.exists()) {
        const { token } = tokenSnap.data();

        return (
          jwt.verify(accessToken, config.get('accessSecret')).accessToken ===
          jwt.verify(token.accessToken, config.get('accessSecret')).accessToken
        );
      }
      return false;
    } catch (error) {
      console.log(error, 'error occured');
      return false;
    }
  }
}

module.exports = new TokenService();
