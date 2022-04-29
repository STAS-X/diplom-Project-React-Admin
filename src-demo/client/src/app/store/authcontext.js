import { createAction, createSlice } from '@reduxjs/toolkit';
import localStorageService from '../services/localStorage.service';
// import commentService from "../services/comment.service";

const initialState = localStorageService.getToken()
  ? {
      auth: localStorageService.getUser(),
      token: localStorageService.getToken(),
      isLoggedIn: true,
      error: null,
    }
  : {
      entities: null,
      isLoading: false,
      error: null,
      auth: null,
      isLoggedIn: false,
      dataLoaded: false,
    };

const commentsSlice = createSlice({
  name: 'authcontext',
  initialState,
  reducers: {
    authSetUser: (state, action) => {
      state.auth =
        action.payload === null ? null : action.payload;
      state.isLoggedIn = action.payload ? true : false;
      if (action.payload !== null) localStorageService.setUser(action.payload);
    },
    authSetToken: (state, action) => {
      state.token =
        action.payload === null ? null : action.payload;
      if (action.payload !== null) localStorageService.setToken(action.payload);
    },
    authLogout: (state, action) => {
      state.auth = null;
      state.token = null;
      state.isLoggedIn = false;
      localStorageService.removeAuthData();
    },
    authSetLoggedStatus: (state, action) => {
      state.isLoggedIn = action.payload;
      if (!action.payload) {
        state.auth = null;
        state.token = null;
      }
    },
    authSetError: (state, action) => {
      state.error = action.payload;
    },
  },
});

const { reducer: authReducer, actions } = commentsSlice;
const { authSetUser,authSetToken, authSetError, authLogout, authSetLoggedStatus } = actions;

// const addCommentRequested = createAction("comments/addCommentRequested");
// const removeCommentRequested = createAction("comments/removeCommentRequested");
export const setAuthUser = (payload) => (dispatch) => {
  try {
    dispatch(authSetUser(payload));
  } catch (error) {
    dispatch(authSetError(error));
  }
};

export const setAuthToken = (payload) => (dispatch) => {
  try {
    dispatch(authSetToken(payload));
  } catch (error) {
    dispatch(authSetError(error));
  }
};

export const setAuthLogout = () => (dispatch) => {
  dispatch(authLogout());
};

export const setAuthLoggedStatus = (payload) => (dispatch) => {
  dispatch(authSetLoggedStatus(payload));
};

export const setAuthError = (payload) => (dispatch) => {
  dispatch(authSetError(payload));
};

export const getAuthData = () => (state) => {
  return { user: state.authContext.auth, token: state.authContext.token };
};
export const getAuthUser = () => (state) => {
  return state.authContext.auth;
};

export const getLoggedStatus = () => (state) => state.authContext.isLoggedIn;
export const getAuthError = () => (state) => state.authContext.error;

export default authReducer;
