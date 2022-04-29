import { useEffect, useMemo } from 'react';
import {
  toastDarkBounce,
  toastErrorBounce,
} from '../../../utils/animateTostify';
import PropTypes from 'prop-types';

import { useDispatch, useSelector } from 'react-redux';

import localStorageService from '../../../services/localStorage.service';
import { firebaseApp } from '../../../dbapp/initFireBase';
import {
  getAuthError,
  getAuthData,
  setAuthError,
  setAuthLogout,
  setAuthLoggedStatus,
  setAuthUser,
  setAuthToken,
} from '../../../store/authcontext';
import { getAppError, setAppError } from '../../../store/appcontext';
import authService from '../../../services/auth.service';
import { getHook } from 'react-hooks-outside';
import { useLogout } from 'react-admin';

const AppLoader = ({ children }) => {
  //const data = select(getAuthData());
  const { user: authUser, token: authToken } = useSelector(getAuthData());
  const authError = useSelector(getAuthError());
  const appError = useSelector(getAppError());
  const memoError = useMemo(() => authError || appError, [authError, appError]);
  // const memoLogged = useMemo(() => isLoggedIn, [isLoggedIn]);
  const handleLogout = () => {
    const logout = getHook('logout');
    logout();
  }
  
  useEffect(() => {
    const dispatch = getHook('dispatch');

    const unregisterAuthObserver = firebaseApp
      .auth()
      .onAuthStateChanged(async (user) => {
        if (user) {
          const { data } = authToken
            ? await authService.getAuthData(authToken.accessToken)
            : { data: { user: null, token: null } };

          if (data.user || localStorageService.getUser()) {
            dispatch(setAuthUser(data.user || localStorageService.getUser()));
            dispatch(
              setAuthToken(data.token || localStorageService.getToken())
            );
          } else {
            dispatch(setAuthLogout());
            handleLogout();
          }
        } else {
          // No user is signed in.
          dispatch(setAuthLogout());
          handleLogout();
        }
      });
    return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
  }, []);

  useEffect(() => {
    //console.log('Произошла ошибка');
    const dispatch = getHook('dispatch');

    if (memoError) {
      if (memoError.name === 'AuthorizationError') {
        dispatch(setAppError(null));
        dispatch(setAuthError(null));
        toastErrorBounce('Обнаружена ошибка:', `${memoError.error.message}`);

        dispatch(setAuthLogout());
        handleLogout();
      } else {
        dispatch(setAppError(null));
        dispatch(setAuthError(null));
        toastDarkBounce(
          'При выполнении запроса произошла ошибка:',
          `${memoError.message}`
        );
      }
    }
  }, [memoError]);

  return children;
};

AppLoader.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};
export default AppLoader;
