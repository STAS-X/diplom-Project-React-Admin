import axios from 'axios';
//import { toastDarkBounce } from '../utils/animateTostify';
import { setAppError } from '../store/appcontext';
import {
  setAuthRefreshToken,
  getAuthData,
  getAuthToken,
} from '../store/authcontext';
import configFile from '../config/default.json';
import { useSelector } from 'react-redux';
import authService from './auth.service';
import { getHook } from 'react-hooks-outside';
import localStorageService from './localStorage.service';
import { firebaseApp, authProvider } from '../dbapp/initFireBase';

const http = axios.create({
  baseURL: configFile.isFireBase
    ? process.env.NODE_ENV === 'production'
      ? configFile.apiDataEndpointProd
      : configFile.apiDataEndpoint
    : configFile.apiEndpoint,
});

function getToken() {
  const dispatch = getHook('dispatch');

  console.log(token);
  return token;
}

http.interceptors.request.use(
  async function (config) {
    if (configFile.isFireBase) {
      //const selector = getHook('selector');
      const dispatch = getHook('dispatch');
      const { token } = dispatch(getAuthToken());

      const { expirationTime, refreshToken, accessToken } = token;

      //const authToken =
      //  firebaseApp.auth().currentUser._delegate.stsTokenManager;
      if (refreshToken && expirationTime < Date.now()) {
        const { stsTokenManager: authToken } = (await authProvider.checkAuth())._delegate;
        const data = await dispatch(setAuthRefreshToken({...authToken}));

        if (data) {
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${accessToken}`,
          };
        } else {
          config.headers = {
            ...config.headers,
            Authorization: '',
          };
        }
      } else {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${accessToken}`,
        };
      }
    }
    return config;
  },
  function (error) {
    let expectedErrors = false;
    let errorData = {};
    const dispatch = getHook('dispatch');

    if (error.request) {
      expectedErrors =
        error.request.status >= 300 && error.request.status < 500;
      errorData = error.request.data;
      dispatch(setAppError(errorData));
    } else if (error.message) {
      errorData = {
        code: error.status,
        name: 'NetworkError',
        message: error.message,
      };
      dispatch(setAppError(errorData));
    }

    return Promise.reject(error);
  }
);

http.interceptors.response.use(
  (res) => {
    return res;
  },
  function (error) {
    let expectedErrors = false;
    let errorData = {};
    const dispatch = getHook('dispatch');

    if (error.response) {
      expectedErrors =
        error.response.status >= 300 && error.response.status < 500;
      errorData = error.response.data;
      dispatch(setAppError(errorData));
    } else if (error.message) {
      errorData = {
        code: error.status,
        name: 'NetworkError',
        message: error.message,
      };
      dispatch(setAppError(errorData));
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
