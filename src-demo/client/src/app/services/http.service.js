import axios from 'axios';
import { useState } from 'react';
//import { toastDarkBounce } from '../utils/animateTostify';
import { setAppError } from '../store/appcontext';
import {
  setAuthRefreshToken,
  getAuthToken,
  getAuthData,
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

http.interceptors.request.use(
  async function (config) {
    if (configFile.isFireBase) {
      const { getState } = getHook('store');
      const dispatch = getHook('dispatch');

      //console.log(useStore.getState);
      //const token  = useStore((state) => state.authContext.token);
      const token = getState().authContext.token;
      const {uid} =getState().authContext.auth;

      const {
        expirationTime = null,
        refreshToken = null,
        accessToken = null,
      } = token;

      //const authToken =
      //  firebaseApp.auth().currentUser._delegate.stsTokenManager;
      if (refreshToken && expirationTime && expirationTime < Date.now()) {
        const { stsTokenManager: authToken, uid } = (await authProvider.checkAuth())
          ._delegate;
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
            UserUid: ''
          };
        }
      } else {
        config.headers = {
          ...config.headers,
          Authorization: accessToken ? `Bearer ${accessToken}` : '',
          UserUid: accessToken ?`${uid}`:''
          // DataUserId: `${user.uid}`
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
    console.log(res, res.data, 'request response');
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
