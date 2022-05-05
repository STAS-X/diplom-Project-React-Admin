import { createAction, createSlice } from '@reduxjs/toolkit';
import localStorageService from '../services/localStorage.service';
import authService from '../services/auth.service';
// import commentService from "../services/comment.service";

const initialState = localStorageService.getToken()
  ? {
      auth: localStorageService.getUser(),
      token: localStorageService.getToken(),
      isLoggedIn: true,
      isAuthFromDB: false,
      error: null,
    }
  : {
      entities: null,
      isLoading: false,
      error: null,
      auth: null,
      isLoggedIn: false,
      isAuthFromDB: false,
      dataLoaded: false,
    };

const authSlice = createSlice({
  name: 'authcontext',
  initialState,
  reducers: {
    authSetUser: (state, action) => {
      state.auth = action.payload === null ? null : action.payload;
      state.isLoggedIn = action.payload ? true : false;
      if (action.payload !== null) localStorageService.setUser(action.payload);
    },
    authSetToken: (state, action) => {
      state.token = action.payload === null ? null : action.payload;
      if (action.payload !== null) localStorageService.setToken(action.payload);
    },
    authLogout: (state, action) => {
      state.auth = null;
      state.token = null;
      state.isLoggedIn = false;
      localStorageService.removeAuthData();
    },
    authSetAuthDBStatus: (state, action) => {
      state.isAuthFromDB = action.payload;
    },
    authSetLoggedStatus: (state, action) => {
      state.isLoggedIn = action.payload;
      if (!action.payload) {
         localStorageService.removeAuthData();
        state.auth = null;
        state.token = null;
      }
    },
    authSetError: (state, action) => {
      state.error = action.payload;
    },
  },
});

const { reducer: authReducer, actions } = authSlice;
const {
  authSetUser,
  authSetToken,
  authSetError,
  authLogout,
  authSetLoggedStatus,
  authSetAuthDBStatus,
} = actions;

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

export const setAuthLogout = () => async (dispatch, state) => {
  try {
    if (state().authContext.isLoggedIn) {
      await authService.logout();
    }
    dispatch(authLogout());

  } catch (error) {
    dispatch(authSetError(error));
  }
};

export const setAuthLoggedStatus = (payload) => (dispatch) => {
  dispatch(authSetLoggedStatus(payload));
};

export const setAuthError = (payload) => (dispatch) => {
  dispatch(authSetError(payload));
};

export const setAuthDBStatus = (payload) => (dispatch) => {
  dispatch(authSetAuthDBStatus(payload));
};

export const setAuthFromDB = (payload) => async (dispatch) => {
  try {
    const { data } = await authService.getAuthData(payload);
    if (data.user) dispatch(setAuthUser(data.user));
    if (data.token) dispatch(setAuthToken(data.token));
    dispatch(authSetAuthDBStatus(true));
    console.log('data from server success');
  } catch (error) {
    dispatch(authSetError(error));
  }
};
export const setAuthRefreshToken = (payload) => async (dispatch) => {
  try {
    const { data } = await authService.refreshToken(payload);
    if (data.token) {
      dispatch(setAuthToken(data.token));
      return { ...data.token };
    }
    return null;
  } catch (error) {
    dispatch(authSetError(error));
  }
};

export const getAuthData = () => (state) => {
  return { user: state.authContext.auth, token: state.authContext.token };
};

// export const getAuthToken = () => (state) => {
//   return state.authContext.token;
// };

export const getLoggedStatus = () => (state) => state.authContext.isLoggedIn;
export const getAuthDBStatus = () => (state) => state.authContext.isAuthFromDB;
export const getAuthError = () => (state) => state.authContext.error;

export default authReducer;
