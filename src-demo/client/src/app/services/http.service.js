import axios from 'axios';
//import { toastDarkBounce } from '../utils/animateTostify';
import { setAppError } from '../store/appcontext';
import { setAuthToken } from '../store/authcontext';
import configFile from '../config/default.json';
import authService from './auth.service';
import { getHook } from 'react-hooks-outside';
import localStorageService from './localStorage.service';
import { authProvider } from '../dbapp/initFireBase';
import { getAuthData } from '../store/authcontext';

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
      const selector = getHook('selector');
      const dispatch = getHook('dispatch');

      const { token } = selector(getAuthData());

      // const containSlash = /\/$/gi.test(config.url);
      // config.url =
      //     (containSlash ? config.url.slice(0, -1) : config.url) + ".json";
      const { expirationTime, refreshToken, accessToken } =
        token || localStorageService.getToken();

      // const expireSession = Math.floor(
      //   (Math.abs(Date.now() - expiresDate) / (1000 * 3600)) % 24
      // );
      let authToken = token;

      if (refreshToken && expirationTime < Date.now()) {
        if (authProvider.auth().currentUser) {
          const authToken =
            authProvider.auth().currentUser._delegate.stsTokenManager;
          const { data } = await authService.refreshToken(authToken);
          if (
            data.token &&
            data.token.refreshToken &&
            data.token.expirationTime > Date.now()
          )
            authToken = data.token;
          dispatch(setAuthToken(authToken));
        } else authToken = null;
      } else authToken = null;

      if (!authToken) {
        config.headers = {
          ...config.headers,
          Authorization: '',
        };
      } else {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${authToken.accessToken}`,
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
