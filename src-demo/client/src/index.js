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

import { ReactHooksWrapper, setHook } from 'react-hooks-outside/lib';

import { useDispatch, useSelector, useStore } from 'react-redux';
import { useLogout, useRedirect } from 'react-admin';


const store =createAdminStore({
        authProvider,
        dataProvider,
        history,
      })

const MakeHookElement = () => {
    setHook('dispatch', useDispatch);
    setHook('store', useStore)
      .setHook('selector', () => useSelector)
      .setHook('logout', useLogout)
      .setHook('redirect', useRedirect);

  return (
    <ReactHooksWrapper />
  )
}

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <MakeHookElement />
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
      </BrowserRouter>
    </Provider>
    <ToastContainer />
  </React.StrictMode>,
  document.getElementById('root')
);

