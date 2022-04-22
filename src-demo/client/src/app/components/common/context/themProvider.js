import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import firebase from 'firebase/compat/app';
import { createBrowserHistory } from 'history';

const { Provider, Consumer } = React.createContext();

const CustomAppProvider = ({ children }) => {
  const [mode, setTheme] = useState('light');
  const [authData, setAuthData] = useState();
  const [history, setHistory] = useState(createBrowserHistory());

  // Listen to the Firebase Auth state and set the local state.
  useEffect(() => {
    const unregisterAuthObserver = firebase
      .auth()
      .onAuthStateChanged((user) => {
        if (user) {
          //console.log(user, 'User was login');
          const { displayName, email, photoURL, providerId, uid } =
            user._delegate.providerData[0];
          const { stsTokenManager: tokenData } = user._delegate;
          // console.log('User login', tokenData, user._delegate.providerData[0]);
          handleAuthData(
            {
              displayName: displayName ? displayName : 'John Dow',
              email,
              photoURL: photoURL
                ? photoURL
                : `https://avatars.dicebear.com/api/avataaars/${(
                    Math.random() + 1
                  )
                    .toString(36)
                    .substring(7)}.svg`,
              providerId,
              uid,
            },
            tokenData
          );
          console.log(user.getIdToken(), tokenData, 'Get token data');
        }
      });
    const unregisterAuthTokenObserver = firebase
      .auth()
      .onIdTokenChanged(async (user) => {
        if (user) {
          console.log(user.getIdToken());
        }
      });
    return () => {
      unregisterAuthObserver();
      unregisterAuthTokenObserver();
    }; // Make sure we un-register Firebase observers when the component unmounts.
  }, []);

  const toggleTheme = () => {
    if (mode === 'light') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
    console.log('New theme', mode);
  };

  const handleAuthData = (user, creditial) => {
    console.log('User save to context', user, creditial);
    setAuthData({ user, creditial });
  };

  return (
    <Provider value={{ mode, toggleTheme, authData, handleAuthData, history }}>
      {children}
    </Provider>
  );
};

CustomAppProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

export { CustomAppProvider, Consumer as CustomAppConsumer };
