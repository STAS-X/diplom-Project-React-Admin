import { useEffect, useMemo } from 'react';
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
import { getAppError, setAppError, setAppTitle } from '../../../store/appcontext';
import authService from '../../../services/auth.service';
import { getHook } from 'react-hooks-outside';
import history from '../../../../app/utils/history';
import { useLogout, useRedirect } from 'react-admin';

const handleLogout = () => {
  //const logout = useLogout();
  //logout();
  authProvider.logout();
    setTimeout(()=>history.push('/login'), 500);
};

const AppLoader = ({ children }) => {
  //const { getState } = useStore();
  //const logout = useLogout();
  const { user: authUser, token: authToken } = useSelector(getAuthData());
  //const authUser = getState().authContext.user;
  //const authToken = getState().authContext.token;
  const isLogged = useSelector(getLoggedStatus());
  const pathname = useSelector((state)=>state.router.location.pathname);

    // if (!isLogged) {
    //   handleLogout();
    //   //return;
    // }
  const authDBStatus = useSelector(getAuthDBStatus());
  const authError = useSelector(getAuthError());
  const appError = useSelector(getAppError());
  const memoError = authError || appError;
  // const memoLogged = useMemo(() => isLoggedIn, [isLoggedIn]);

 //const dispatch = getHook('dispatch');
  //let logout = useLogout();
  useEffect(() => {
      const dispatch = getHook('dispatch');
      dispatch(
      setAppTitle(
        pathname.split('/')[1] === 'users'
          ? 'Пользователи'
          : pathname.split('/')[1] === 'tasks'
          ? 'Задачи'
          : pathname.split('/')[1] === 'comments' 
          ? 'Комментарии'
          : pathname.split('/')[1] === 'main'
          ?'Главная страница':'О проекте'
        ) 
      );
      return ()=>{}
  }, [pathname]);

  useEffect(() => {
    const unregisterAuthObserver = firebaseApp
      .auth()
      .onAuthStateChanged((user) => {
        const dispatch = getHook('dispatch');

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
              handleLogout();
            }
          } else {
            dispatch(setAuthDBStatus(false));
          }
        } else {
          // No user is signed in.
          dispatch(setAuthLogout());
          handleLogout();
        }
      });
    return () => unregisterAuthObserver(); 
    // Make sure we un-register Firebase observers when the component unmounts.
  }, []);

  useEffect(() => {
    //console.log('Произошла ошибка');
    const dispatch = getHook('dispatch');

    if (memoError) {
      if (memoError.code === 401 || memoError.code === 403) {
        dispatch(setAppError(null));
        dispatch(setAuthError(null));
        dispatch(setAuthLoggedStatus(false));
        toastErrorBounce(
          'Ошибка доступа:',
          `Требуется повторная авторизация: ${memoError.message}`
        );
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

    return () => {};
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
