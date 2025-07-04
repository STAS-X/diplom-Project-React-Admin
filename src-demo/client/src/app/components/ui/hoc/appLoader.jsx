import { useEffect } from 'react';
import {
  toastDarkBounce,
  toastErrorBounce,
} from '../../../utils/animateTostify';
import PropTypes from 'prop-types';

import { useSelector } from 'react-redux';
import localStorageService from '../../../services/localStorage.service';

import {
  getAuthError,
  getAuthData,
  getAuthDBStatus,
  setAuthError,
  setAuthLoggedStatus
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
  const logout = getHook('logout');
  //const {pathname} = useLocation();

  //const { user: authUser, token: authToken , isLoggedIn } = useSelector(getAuthData());
  const { user: authUser, token: authToken , isLoggedIn } = useSelector(getAuthData());

  const { pathname } = useSelector((state) => state.router.location);

  const authError = useSelector(getAuthError());
  const appError = useSelector(getAppError());
  const memoError = authError || appError;
  // const memoLogged = useMemo(() => isLoggedIn, [isLoggedIn]);

  useEffect(() => {
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

    if (isLoggedIn) {
      if (newTitlePage) dispatch(setAppTitle(newTitlePage));
    //} else {
      // Если мы не залогинились и пытаемся зайти на проект, то принудительно выходим на страницу авторизации
      //await logout();
    }

    return () => {};
  }, [isLoggedIn, pathname]);

  // useEffect(() => {
  //   const unregisterAuthObserver = firebaseApp
  //     .auth()
  //     .onAuthStateChanged(async (user) => {
  //       if (user) {
  //         //const dispatch = getHook('dispatch');
  //         if (!authToken && localStorageService.getToken()) {
  //           if (!authDBStatus) {
  //             // Если данные в сторе отсутствуют, подгружаем их из LocalStarage, если это возможно
  //             const token = localStorageService.getToken();
  //             dispatch(setAuthFromDB(token.accessToken));
  //           } else {
  //             // Если данные уже были запрошены и они отсутствуют в базе, тогда выходим обратно на авторизацию
  //             //await logout();
  //           }
  //         } else {
  //           dispatch(setAuthDBStatus(false));
  //         }
  //       } else {
  //         // No user is signed in.
  //         dispatch(setAuthLogout());
  //         //handleLogout();
  //       }
  //     });
  //   return () => unregisterAuthObserver();
  //   // Make sure we un-register Firebase observers when the component unmounts.
  // }, []);

  useEffect(() => {
    if (memoError) {
      dispatch(setAppError(null));
      dispatch(setAuthError(null));
      console.log(memoError, isLoggedIn, 'Получаем ошибку')
      if (isLoggedIn) {
        if (memoError.code === 401 || memoError.code === 403) {
          // Меняем статус на разлогиненный
          dispatch(setAuthLoggedStatus(false));
          // Чтобы не перезагружать ошибочные данные из LocalStorage удаляем их перед разлогиниванием
          //localStorageService.removeAuthData();
          toastErrorBounce(
            'Ошибка доступа:',
            `Требуется повторная авторизация: ${memoError.message}`
          );
          setTimeout(logout, 2000);
        } else {
          toastDarkBounce(
            'При выполнении запроса произошла ошибка:',
            `${memoError.message}`
          );
        }
      }
    }
    //if (!isLoggedStatus) handleLogout();

    return () => {};
  }, [isLoggedIn, memoError]);

  return children;
};

AppLoader.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};
export default AppLoader;
