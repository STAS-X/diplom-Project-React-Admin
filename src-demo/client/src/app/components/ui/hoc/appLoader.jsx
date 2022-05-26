import { useEffect, useState, useMemo } from 'react';
import {
  toastDarkBounce,
  toastErrorBounce,
} from '../../../utils/animateTostify';
import PropTypes from 'prop-types';

import { useDispatch, useSelector, useStore } from 'react-redux';

import localStorageService from '../../../services/localStorage.service';
import { authProvider, firebaseApp } from '../../../dbapp/initFireBase';
import {
  getAuthError,
  getAuthData,
  setAuthFromDB,
  getAuthDBStatus,
  setAuthDBStatus,
  setAuthError,
  setAuthLogout,
  setAuthLoggedStatus,
  getLoggedStatus,
  setAuthUser,
  setAuthToken,
} from '../../../store/authcontext';
import {
  getAppError,
  setAppError,
  setAppTitle,
} from '../../../store/appcontext';
import authService from '../../../services/auth.service';
import { getHook } from 'react-hooks-outside';
import history from '../../../../app/utils/history';
import { useLogout, useRedirect, useAuthProvider } from 'react-admin';

const AppLoader = ({ children, ...props }) => {
  //const authProvider = useAuthProvider();
  const dispatch = getHook('dispatch');

  const { user: authUser, token: authToken } = useSelector(getAuthData());

  const pathname = useSelector((state) => state.router.location.pathname);
  const isLoggedStatus = useSelector(getLoggedStatus());

  const authDBStatus = useSelector(getAuthDBStatus());
  const authError = useSelector(getAuthError());
  const appError = useSelector(getAppError());
  const memoError = authError || appError;
  // const memoLogged = useMemo(() => isLoggedIn, [isLoggedIn]);

  const handleLogout = () => {
    authProvider.logout().then(()=>history.push('/login'));
  };

  useEffect(() => {
    dispatch(
      setAppTitle(
        pathname.split('/')[1] === 'users'
          ? 'Пользователи'
          : pathname.split('/')[1] === 'tasks'
          ? 'Задачи'
          : pathname.split('/')[1] === 'comments'
          ? 'Комментарии'
          : pathname.split('/')[1] === 'main'
          ? 'Главная страница'
          : 'О проекте'
      )
    );
    return () => {};
  }, [pathname]);

  useEffect(() => {
    const unregisterAuthObserver = firebaseApp
      .auth()
      .onAuthStateChanged((user) => {
        if (user) {
          //const dispatch = getHook('dispatch');
          if (!authToken && localStorageService.getToken()) {
            if (!authDBStatus) {
              // Если данные в сторе отсутствуют, подгружаем их из БД, если это возможно
              const token = localStorageService.getToken();
              dispatch(setAuthFromDB(token.accessToken));
            } else {
              // Если данные уже были запрошены и они отсутствуют в базе, тогда выходим на авторизацию
              dispatch(setAuthLogout());
              //handleLogout();
            }
          } else {
            dispatch(setAuthDBStatus(false));
          }
        } else {
          // No user is signed in.
          dispatch(setAuthLogout());
          //handleLogout();
        }
      });
    return () => unregisterAuthObserver();
    // Make sure we un-register Firebase observers when the component unmounts.
  }, []);

  useEffect(() => {
    //console.log('Произошла ошибка');
    if (memoError) {
      dispatch(setAppError(null));
      dispatch(setAuthError(null));
      if (memoError.code === 401 || memoError.code === 403) {
        if (isLoggedStatus) {
          //dispatch(setAuthLoggedStatus(false));
          toastErrorBounce(
            'Ошибка доступа:',
            `Требуется повторная авторизация: ${memoError.message}`
          );
          dispatch(setAuthLogout());
        }
        //handleLogout();
      } else {
        toastDarkBounce(
          'При выполнении запроса произошла ошибка:',
          `${memoError.message}`
        );
      }
    }

    return () => {};
  }, [memoError]);

  useEffect(() => {
    if (!isLoggedStatus) handleLogout();

    return () => {};
  }, [isLoggedStatus]);

  return children;
};

AppLoader.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};
export default AppLoader;
