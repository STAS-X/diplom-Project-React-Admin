import React from 'react';
import ReactDOM from 'react-dom';
import { Switch, Route, Redirect, BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import createAdminStore from './app/store/createStore';
import App from './app/App';
import history from './app/utils/history';
import AppLoader from './app/components/ui/hoc/appLoader';

import { authProvider, dataProvider } from './app/dbapp/initFireBase';

import { ToastContainer } from 'react-toastify';

import { ReactHooksWrapper, setHook, getHook } from 'react-hooks-outside/lib';

import { useDispatch, useSelector } from 'react-redux';
import { useLogout } from 'react-admin';

import registerServiceWorker from './app/api/registerServiceWorker';
import EventMonitor from './app/components/common/event/EventMonitor';
import { getAuthData } from './app/store/authcontext';
import localStorageService from './app/services/localStorage.service';

// authProvider.checkError = (error) => {
//         const status = error.status;
//         if (status === 401 || status === 403) {
//             return Promise.reject({
//                 redirectTo: '/login',
//                 logoutUser: false,
//             });
//         }
//         // other error code (404, 500, etc): no need to log out
//         return Promise.resolve();
//     };
// authProvider.checkAuth = (params) => {
//   console.log(params, 'Параметры')
//   // let's say user is not logged in
//   return Promise.reject({
//     redirectTo: 'https://localhost:3333/#/login',
//   });
// };
setHook('dispatch', useDispatch)
  .setHook('selector', () => useSelector)
  .setHook('logout', useLogout);



ReactDOM.render(
  <React.StrictMode>
    <Provider
      store={createAdminStore({
        authProvider,
        dataProvider,
        history,
      })}
    >
      <BrowserRouter>
        <AppLoader history={history}>
          <App
            authProvider={authProvider}
            dataProvider={dataProvider}
            history={history}
          />
          <Switch>
            <Redirect exact from="/" to="/main" />
          </Switch>
        </AppLoader>

        <ReactHooksWrapper />
      </BrowserRouter>
      <EventMonitor />
    </Provider>
    <ToastContainer />
  </React.StrictMode>,
  document.getElementById('root')
);
registerServiceWorker();
