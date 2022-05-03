// import axios from "axios";
// import configFile from "../config.json";
// import httpService from "./http.service";
import configFile from '../config/default.json';
import axios from 'axios';
import localStorageService from './localStorage.service';
import { setAuthError, getAuthData } from '../store/authcontext';
import { getHook } from 'react-hooks-outside';

const httpAuth = axios.create({
  baseURL: `${
    configFile.isFireBase
      ? process.env.NODE_ENV === 'production'
        ? configFile.apiDataEndpointProd
        : configFile.apiDataEndpoint
      : configFile.apiEndpoint
  }/auth/`,
});

httpAuth.interceptors.response.use(
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
      dispatch(setAuthError(errorData));
    } else if (error.message) {
      errorData = {
        code: error.request.status,
        name: 'NetworkError',
        message: error.message,
      };
      dispatch(setAuthError(errorData));
    }

    return Promise.reject(error);
  }
);

const authService = {
  register: async (payload) => {
    return httpAuth
      .post(`signIn/`, payload)
      .then(({ status, statusText, data }) => {
        if (status < 200 || status >= 300) {
          return { status, message: (error && error.message) || statusText };
        }
        return {
          data,
        };
      });
  },

  logout: async () => {
    const token = localStorageService.getToken();
    return httpAuth
      .delete('signOut/', {
        headers: {
          Authorization: token ? `Bearer ${token.accessToken}` : '',
        },
      })
      .then(({ status, statusText, data }) => {
        if (status < 200 || status >= 300) {
          return { status, message: (error && error.message) || statusText };
        }
        return {
          data,
        };
      });
  },

  refreshToken: async (newToken) => {
    const oldToken = localStorageService.getToken();
    return httpAuth
      .put('token/', 
        {data: { ...newToken, oldRefresh: oldToken.refreshToken} },
        {headers: {
          Authorization: oldToken ? `Bearer ${oldToken.accessToken}` : '',
        }},
      )
      .then(({ status, statusText, data }) => {
        if (status < 200 || status >= 300) {
          return { status, message: (error && error.message) || statusText };
        }
        return {
          data,
        };
      });
  },

  getAuthData: async (accessToken) => {
    //const { accessToken } = localStorageService.getToken();
    return httpAuth
      .get(`authData/`, {
        headers: { Authorization: accessToken ? `Bearer ${accessToken}` : '' },
      })
      .then(({ status, statusText, data }) => {
        if (status < 200 || status >= 300) {
          return { status, message: (error && error.message) || statusText };
        }
        return {
          data,
        };
      });
  },
};
export default authService;
