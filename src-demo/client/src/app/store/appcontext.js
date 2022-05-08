import { createAction, createSlice } from '@reduxjs/toolkit';
import localStorageService from '../services/localStorage.service';
// import commentService from "../services/comment.service";
const initialState = localStorageService.getAppData()
  ? {
      theme: 'light',
      appTitle: 'Главная страница',
      loading: true,
      colorized: true,
      error: null,
      ...localStorageService.getAppData(),
    }
  : {
      theme: 'light',
      appTitle: 'Главная страница',
      loading: true,
      colorized: true,
      error: null,
    };

const appsettingsSlice = createSlice({
  name: 'appcontext',
  initialState,
  reducers: {
    appSetTheme: (state, action) => {
      state.theme = action.payload;
      localStorageService.setAppData({ theme: action.payload });
    },
    appSetTitle: (state, action) => {
      state.appTitle = action.payload;
      localStorageService.setAppData({ appTitle: action.payload });
    },
    appSetLoading: (state, action) => {
      state.loading = action.payload;
      localStorageService.setAppData({ loading: action.payload });
    },
    appSetColorized: (state, action) => {
      state.colorized = action.payload;
      localStorageService.setAppData({ colorized: action.payload });
    },
    appSetError: (state, action) => {
      state.error = action.payload;
    },
  },
});

const { reducer: appReducer, actions } = appsettingsSlice;
const { appSetTheme, appSetTitle, appSetColorized, appSetLoading, appSetError } =
  actions;

// const addCommentRequested = createAction("comments/addCommentRequested");
// const removeCommentRequested = createAction("comments/removeCommentRequested");
export const setAppTheme = () => (dispatch, state) => {
  if (state().appContext.theme === 'light') dispatch(appSetTheme('dark'));
  else dispatch(appSetTheme('light'));
};

export const setAppTitle = (payload) => (dispatch) => {
  dispatch(appSetTitle(payload));
};

export const setAppLoading = () => (dispatch, state) => {
  dispatch(appSetLoading(!state().appContext.loading));
};

export const setAppColorized = () => (dispatch, state) => {
  dispatch(appSetColorized(!state().appContext.colorized));
};

export const setAppError = (payload) => (dispatch) => {
  dispatch(appSetError(payload));
};

export const getAppTheme = () => (state) => state.appContext.theme;
export const getAppTitle = () => (state) => state.appContext.appTitle;
export const getAppLoading = () => (state) => state.appContext.loading;
export const getAppColorized = () => (state) => state.appContext.colorized;
export const getAppError = () => (state) => state.appContext.error;

export default appReducer;
