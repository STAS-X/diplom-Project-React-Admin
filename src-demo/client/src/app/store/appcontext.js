import { createAction, createSlice } from "@reduxjs/toolkit";
// import commentService from "../services/comment.service";
const commentsSlice = createSlice({
  name: 'appcontext',
  initialState: {
    theme: 'light',
    appTitle: 'Главная страница',
    error: null,
  },
  reducers: {
    appSetTheme: (state, action) => {
      state.theme = action.payload;
    },
    appSetTitle: (state, action) => {
      state.appTitle = action.payload;
    },
    appSetError: (state, action) => {
      state.error = action.payload;
    },
  },
});

const { reducer: appReducer, actions } = commentsSlice;
const { appSetTheme, appSetTitle, appSetError } = actions;

// const addCommentRequested = createAction("comments/addCommentRequested");
// const removeCommentRequested = createAction("comments/removeCommentRequested");
export const setAppTheme = () => (dispatch, state) => {
    if (state().appContext.theme === 'light') 
    dispatch(appSetTheme('dark'));
  else 
    dispatch(appSetTheme('light'));  
};

export const setAppTitle = (payload) => (dispatch) => {
   dispatch(appSetTitle(payload));  
};

export const setAppError = (payload) => (dispatch) => {
    dispatch(appSetError(payload));
};

export const getAppTheme = () => (state) => state.appContext.theme;
export const getAppTitle = () => (state) => state.appContext.appTitle;
export const getAppError = () => (state) => state.appContext.error;

export default appReducer;
