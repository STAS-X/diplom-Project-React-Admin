import { createAction, createSlice } from '@reduxjs/toolkit';
import firebase from 'firebase/compat/app';
// import commentService from "../services/comment.service";
const commentsSlice = createSlice({
  name: 'authcontext',
  initialState: {
    auth: null,
    token: null,
    isLoggedIn: false,
    error: null,
  },
  reducers: {
    authSetData: (state, action) => {
      state.auth = action.payload.user === null? null: {...action.payload.user};
      state.token = action.payload.token === null? null: {...action.payload.token};
      state.isLoggedIn = action.payload.user ? true : false;
    },
    authLogout: (state, action) => {
      state.auth = null;
      state.token = null;
      state.isLoggedIn = firebase.auth().currentUser?true:false;
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
const { authSetData, authSetError, authLogout, authSetLoggedStatus } = actions;

// const addCommentRequested = createAction("comments/addCommentRequested");
// const removeCommentRequested = createAction("comments/removeCommentRequested");
export const setAuthData = (payload) => (dispatch) => {
  try {
    dispatch(authSetData(payload));
  } catch (error) {
    dispatch(authSetError(error));
  }
};

export const setAuthLogout = () => (dispatch) => {
  dispatch(authLogout({ user: null, token: null }));
};

export const setAuthLoggedStatus = (payload) => (dispatch) => {
  dispatch(authSetError(payload));
};

export const setAuthError = (payload) => (dispatch) => {
  dispatch(authSetLoggedStatus(payload));
};

export const getAuthData = () => (state) => {
  return { user: state.authContext.auth, token: state.authContext.token };
};
export const getLoggedStatus = () => (state) => state.authContext.isLoggedIn;
export const getAuthError = () => (state) => state.authContext.error;

export default authReducer;
