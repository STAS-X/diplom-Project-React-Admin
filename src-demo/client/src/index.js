import React from 'react';
import ReactDOM from 'react-dom';
import { Switch, Route, Redirect, BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import createAdminStore from './app/store/createStore';
import App from './app/App';
import history from './app/utils/history';
import AppLoader from './app/components/ui/hoc/appLoader';

import { authProvider, dataProvider } from './app/dbapp/initFireBase';

import registerServiceWorker from './app/api/registerServiceWorker';
import EventMonitor from './app/components/common/event/EventMonitor';

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
//   console.log(params, 'Пааметры')
//   // let's say user is not logged in
//   return Promise.reject({
//     redirectTo: 'https://localhost:3333/#/login',
//   });
// };

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
          <EventMonitor />
          <Switch>
            <Redirect exact from="/" to="/main" />
          </Switch>
        </AppLoader>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
registerServiceWorker();
