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

import { useDispatch, useSelector, useStore } from 'react-redux';
import { useLogout, useRedirect } from 'react-admin';

import registerServiceWorker from './app/api/registerServiceWorker';
import EventMonitor from './app/components/common/event/EventMonitor';
import { getAuthData } from './app/store/authcontext';
import localStorageService from './app/services/localStorage.service';

setHook('dispatch', useDispatch)
setHook('store', useStore)
  .setHook('selector', () => useSelector)
  .setHook('logout', useLogout)
  .setHook('redirect', useRedirect);

const store =createAdminStore({
        authProvider,
        dataProvider,
        history,
      })


ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
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
