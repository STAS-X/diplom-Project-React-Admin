import axios from 'axios';
//import { toastDarkBounce } from '../utils/animateTostify';
import { setAppError } from '../store/appcontext';
import {
  setAuthRefreshToken,
} from '../store/authcontext';
import configFile from '../config/default.json';
import { getHook } from 'react-hooks-outside';
import { firebaseApp, authProvider } from '../dbapp/initFireBase';

const http = axios.create({
  baseURL: configFile.isFireBase
    ? process.env.NODE_ENV === 'production'
      ? configFile.apiDataEndpointProd
      : configFile.apiDataEndpoint
    : configFile.apiEndpoint,
});

http.interceptors.request.use(
  async function (config) {
    if (configFile.isFireBase) {
      const { getState } = getHook('store');
      const dispatch = getHook('dispatch');

      const token = getState().authContext.token;
      const user = getState().authContext.auth;

      const {
        expirationTime = null,
        refreshToken = null,
        accessToken = null,
      } = token;

      //const authToken =
      //  firebaseApp.auth().currentUser._delegate.stsTokenManager;
      if (refreshToken && expirationTime && expirationTime < Date.now()) {
        const { stsTokenManager: authToken, uid } = (
          await authProvider.checkAuth()
        )._delegate;
        const data = await dispatch(setAuthRefreshToken(authToken));

        if (data) {
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${data.accessToken}`,
            UserUid: `${uid}`,
          };
        } else {
          config.headers = {
            ...config.headers,
            Authorization: '',
            UserUid: '',
          };
        }
      } else {
        config.headers = {
          ...config.headers,
          Authorization: accessToken ? `Bearer ${accessToken}` : '',
          UserUid: accessToken ? `${user.uid}` : '',
          // DataUserId: `${user.uid}`
        };
      }
    }
    return config;
  },
  function (error) {
    const expectedErrors = error.response
      ? error.response.status >= 300 &&
        error.response.status <= 500 &&
        error.response.data?.code !== 200
      : error.status >= 300 && error.status <= 500;

    if (expectedErrors) {
      const dispatch = getHook('dispatch');
      if (error.response) {
        const errorData = error.response.data;
        dispatch(setAppError(errorData));
      } else if (error.message) {
        const errorData = {
          code: error.status,
          name: 'NetworkError',
          message: error.message,
        };
        dispatch(setAppError(errorData));
      }
    }

    return Promise.reject(error);
  }
);

http.interceptors.response.use(
  (res) => {
    return res;
  },
  function (error) {
    const expectedErrors = error.response
      ? error.response.status >= 300 &&
        error.response.status <= 500 &&
        error.response.data?.code !== 200
      : error.status >= 300 && error.status <= 500;

    if (expectedErrors) {
      const dispatch = getHook('dispatch');
      if (error.response) {
        const errorData = error.response.data;
        dispatch(setAppError(errorData));
      } else if (error.message) {
        const errorData = {
          code: error.status,
          name: 'NetworkError',
          message: error.message,
        };
        dispatch(setAppError(errorData));
      }
    }

    return Promise.reject(error);
  }
);
const httpService = {
  get: http.get,
  post: http.post,
  put: http.put,
  delete: http.delete,
  patch: http.patch,
};
export default httpService;
