import { useEffect } from 'react';
import {
  toastDarkBounce,
  toastErrorBounce,
} from '../../../utils/animateTostify';
import PropTypes from 'prop-types';

import { useSelector } from 'react-redux';
import { Redirect, useLocation } from 'react-router-dom';
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
  getLoggedStatus,
} from '../../../store/authcontext';
import {
  getAppError,
  setAppError,
  setAppTitle,
} from '../../../store/appcontext';
import { getHook } from 'react-hooks-outside';

const AppLoader = ({ children }) => {
  //const authProvider = useAuthProvider();
  const dispatch = getHook('dispatch');
  //const {pathname} = useLocation();

  const { user: authUser, token: authToken } = useSelector(getAuthData());

  const {pathname} = useSelector((state) => state.router.location);
  const isLoggedStatus = useSelector(getLoggedStatus());

  const authDBStatus = useSelector(getAuthDBStatus());
  const authError = useSelector(getAuthError());
  const appError = useSelector(getAppError());
  const memoError = authError || appError;
  // const memoLogged = useMemo(() => isLoggedIn, [isLoggedIn]);

  const handleLogout = () => {
    authProvider.logout().then(() => (
      <Redirect
        to={{
          pathname: '/login',
          state: { location },
        }}
      />
    ));
  };

  useEffect(() => {
    if (isLoggedStatus) {
      const newTitlePage =
        pathname.split('/')[1] === 'users'
          ? 'Пользователи'
          : pathname.split('/')[1] === 'tasks'
          ? 'Задачи'
          : pathname.split('/')[1] === 'comments'
          ? 'Комментарии'
          : pathname.split('/')[1] === 'main'
          ? 'Главная страница'
          : pathname.split('/')[1] === 'project'
          ? 'О проекте'
          : '';
      if (newTitlePage) dispatch(setAppTitle(newTitlePage));
    }
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
