// import qualitiesReducer from "./qualities";
import authReducer from "./authcontext";
import appReducer from "./appcontext";
//const { combineReducers, configureStore } = require("@reduxjs/toolkit");

// const rootReducer = combineReducers({
//   auth: authReducer,
//   appContext: appReducer,
// });

// export function createStore() {
//     return configureStore({
//         reducer: rootReducer,
//     });
// }

import { applyMiddleware, combineReducers, compose, createStore, configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk'; 
import { routerMiddleware, connectRouter } from 'connected-react-router';
import createSagaMiddleware from 'redux-saga';
import { all, fork } from 'redux-saga/effects';
import {
    adminReducer,
    adminSaga,
    USER_LOGOUT,
} from 'react-admin';

export default ({
    authProvider,
    dataProvider,
    history,
}) => {
    const rootReducer = combineReducers({
        admin: adminReducer,
        router: connectRouter(history),
        appContext: appReducer,
        authContext: authReducer,        
        // add your own reducers here
    });
    const resettableAppReducer = (state, action) =>
        rootReducer(action.type !== USER_LOGOUT ? state : undefined, action);

    const saga = function* rootSaga() {
        yield all(
            [
                adminSaga(dataProvider, authProvider),
                // add your own sagas here
            ].map(fork)
        );
    };
    const sagaMiddleware = createSagaMiddleware();

    const composeEnhancers =
        (process.env.NODE_ENV === 'development' &&
            typeof window !== 'undefined' &&
            window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
            window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
                trace: true,
                traceLimit: 25,
            })) ||
        compose;
  
    const store = createStore(
        resettableAppReducer,
        { /* set your initial state here */ },
        composeEnhancers(
            applyMiddleware(
                sagaMiddleware,
                routerMiddleware(history),
                thunk
                // add your own middlewares here
            ),
            // add your own enhancers here
        ),        
    );
    sagaMiddleware.run(saga);
    return store;
};