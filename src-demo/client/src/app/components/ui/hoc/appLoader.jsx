import { useEffect, useMemo, useState } from 'react';
import { toastDarkBounce } from '../../../utils/animateTostify';
import PropTypes from 'prop-types';
import { useLogout } from 'react-admin';
import { useDispatch, useSelector } from 'react-redux';
import {
  setAuthData,
  setAuthLogout,
  getLoggedStatus,
  setAuthLoggedStatus,
  getAuthError,
} from '../../../store/authcontext';
import { getAppError } from '../../../store/appcontext';
import firebase from 'firebase/compat/app';

const handleUserTokenRefresh = (user, dispatch, logout) => {
  if (user) {
    dispatch(setAuthLoggedStatus(true));
    const { displayName, email, photoURL, providerId, uid } =
      user._delegate.providerData[0];
    const { stsTokenManager: token } = user._delegate;
    dispatch(
      setAuthData({
        user: {
          displayName: displayName ? displayName : 'John Dow',
          email,
          photoURL: photoURL
            ? photoURL
            : `https://avatars.dicebear.com/api/avataaars/${(Math.random() + 1)
                .toString(36)
                .substring(7)}.svg`,
          providerId,
          uid,
        },
        token,
      })
    );
  } else {
    // dispatch(setAuthLoggedStatus(false));
    // No user is signed in.
    dispatch(setAuthLogout());
    logout();
  }
};

const AppLoader = ({ history, children }) => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(getLoggedStatus());
  const authError = useSelector(getAuthError());
  const appError = useSelector(getAppError());
  const memoError = useMemo(() => authError || appError, [authError, appError]);
  const memoLogged = useMemo(() => isLoggedIn, [isLoggedIn]);
  const logout = useLogout();

  useEffect(() => {
    if (memoError && memoError.message) {
      toastDarkBounce(memoError.message);
      setTimeout(() => {
        dispatch(setAuthLogout());
        logout();
      }, 1500);
      return 'need reauthorization';
    }
  }, [memoError]);

  // Listen to the Firebase Auth state and set the local state.
  useEffect(() => {
    const unregisterAuthObserver = firebase
      .auth()
      .onAuthStateChanged(async (user) => {
        handleUserTokenRefresh(user, dispatch, logout);
      });
    const unregisterAuthTokenObserver = firebase
      .auth()
      .onIdTokenChanged(async (user) => {
        handleUserTokenRefresh(user, dispatch, logout);
      });
    return () => {
      unregisterAuthObserver();
      unregisterAuthTokenObserver();
    }; // Make sure we un-register Firebase observers when the component unmounts.
  }, []);

  return children;
};

AppLoader.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};
export default AppLoader;
