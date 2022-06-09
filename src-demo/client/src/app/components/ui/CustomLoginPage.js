// LoginPage.js
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Login, LoginForm } from 'react-admin';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase/compat/app';
import ForgotPasswordButton from './CustomForgotPassword';
import { getHook } from 'react-hooks-outside';
import authService from '../../services/auth.service';
import { nanoid } from 'nanoid';
import {
  setAuthLoggedStatus,
  setAuthDBStatus,
  setAuthUser,
  setAuthToken,
} from '../../store/authcontext';
import { getAppTitle } from '../../store/appcontext';
// import {
//   getAuth,
//   signOut,
//   getRedirectResult,
//   signInWithRedirect,
//   GoogleAuthProvider,
// } from 'firebase/auth';


const switchToAppPage = (currentPage) => {
  switch (currentPage) {
    case 'Главная страница':
      return '/main';
    case 'Пользователи':
      return '/users';
    case 'Задачи':
      return '/tasks';
    case 'Комментарии':
      return '/comments';
    case 'О проекте':
      return '/project';
    default:
      return '/main';
  }
  //
};

const SignInScreen = () => {
  const mainAppPage = useSelector(getAppTitle());
  //const auth=getAuth();
  // Configure FirebaseUI.
  const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
    signInSuccessUrl: '/main',
    // We will display Google and Email as auth providers.
    signInOptions: [
      {
        provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
        signInMethod:
          firebase.auth.EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD,
        //   firebase.auth.EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD,
      },
      {
        provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        signInMethod: firebase.auth.GoogleAuthProvider.GOOGLE_SIGN_IN_METHOD,
      },
    ],
    autoUpgradeAnonymousUsers: true,
    // Optional callbacks in order to get Access Token from Google,Facebook,... etc
    callbacks: {
      signInWithPopup: () =>
        (auth, provider)
          .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);

            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            // ...
          })
          .catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
          }),
      signInSuccessWithAuthResult: (result) => {
        const credential = result.credential;
        // The signed-in user info.
        const user = result.user;

        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      },
      // signInFailure callback must be provided to handle merge conflicts which
      // occur when an existing credential is linked to an anonymous user.
      signInFailure: (error) => {
        // For merge conflicts, the error.code will be
        // 'firebaseui/anonymous-upgrade-merge-conflict'.
        if (error.code != 'firebaseui/anonymous-upgrade-merge-conflict') {
          return Promise.resolve();
        }
        // The credential the user tried to sign in with.
        var cred = error.credential;
        // Copy data from anonymous user to permanent user and delete anonymous
        // user.
        // ...
        // Finish sign-in after data is copied.
        return firebase.auth().signInWithCredential(cred);
      },
    },
  };

  const handleUserTokenRefresh = async (user) => {
    //const logout = getHook('logout');
    const dispatch = getHook('dispatch');

    const {
      displayName: name,
      email,
      photoURL: url,
      uid,
      providerData: [{ providerId }],
    } = user._delegate;

    const authUser = {
      name: name ? name : email,
      email,
      url: url ? url : `https://i.pravatar.cc/300?u=${nanoid(10)}`,
      providerId,
      uid,
    };
    const authToken = { ...user._delegate.stsTokenManager };
    // Проверяем на существование зарегистрированного пользователя и если он есть в firebase.auth() загружаем его в БД
    const { data } = await authService.register({
      user: authUser,
      token: authToken,
    });

    dispatch(setAuthLoggedStatus(true));
    dispatch(setAuthToken(data.token));
    dispatch(setAuthUser(data.user));
    dispatch(setAuthDBStatus(false));
  };

  const [isSignedIn, setIsSignedIn] = useState(false); // Local signed-in state.

  useEffect(() => {

    const unregisterAuthObserver = firebase
      .auth()
      .onAuthStateChanged((user) => {
        if (user) {
          setIsSignedIn(!!user);
          handleUserTokenRefresh(user);
        } else {
          // No user is signed in.
        }
      });
    return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
  }, []);

  if (!isSignedIn) {
    return (
      <div>
        <p style={{ marginLeft: '10px' }}>Выберите провайдер:</p>
        <StyledFirebaseAuth
          uiConfig={uiConfig}
          firebaseAuth={firebase.auth()}
        />
      </div>
    );
  } else {
    return <Redirect to={switchToAppPage(mainAppPage)} />;

    // <div style={{ marginLeft: '10px' }}>
    //   <h4>Добро пожаловать в приложение</h4>
    //   <p>{firebase.auth().currentUser.displayName}!</p>
    //   <a onClick={() => firebase.auth().signOut()}>Sign-out</a>
    // </div>
  }
};

const CustomLoginForm = () => {
  React.useEffect(() => {
    //document.querySelector('.MuiButton-label').insertAdjacentHTML('afterend', '<span>Войти</span>');
    document.querySelector('#username-label').innerHTML = 'Пользователь';
    document.querySelector('#password-label').innerHTML = 'Пароль';

    return () => {};
  }, []);
  return (
    <div>
      <div
        style={{ fontFamily: 'monospace', marginLeft: '15px', display: 'grid' }}
      >
        <p>Пользователь: test@example.com</p>
        <p>Пароль: password</p>
      </div>
      <LoginForm />
      <SignInScreen />
      <ForgotPasswordButton />
    </div>
  );
};

const CustomLoginPage = () => (
  <Login>
    <CustomLoginForm />
  </Login>
);

export default CustomLoginPage;
