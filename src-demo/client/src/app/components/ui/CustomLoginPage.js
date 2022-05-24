// LoginPage.js
import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Login, LoginForm } from 'react-admin';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase/compat/app';
import ForgotPasswordButton from './CustomForgotPassword';
import { getHook } from 'react-hooks-outside';
import authService from '../../services/auth.service';
import {
  setAuthLoggedStatus,
  setAuthDBStatus,
  setAuthUser,
  setAuthToken,
} from '../../store/authcontext';
//import { GoogleAuthProvider } from "firebase/auth";

const handleUserTokenRefresh = async (user) => {
  const dispatch = getHook('dispatch');
  //const logout = getHook('logout');

  const {
    displayName:name,
    email,
    photoURL:url,
    uid,
    providerData: [{ providerId }],
  } = user._delegate;

  const authUser = {
    name: name ? name : email,
    email,
    url: url
      ? url
      : `https://avatars.dicebear.com/api/avataaars/${(Math.random() + 1)
          .toString(36)
          .substring(7)}.svg`,
    providerId,
    uid,
  };
  const authToken = { ...user._delegate.stsTokenManager };
console.log(authToken, 'authtoken taked');
  // Проверяем на существование зарегистрированного пользователя и если он есть в firebase.auth() загружаем его в БД
  const { data } = await authService.register({
    user: authUser,
    token: authToken,
  });

  dispatch(setAuthToken(data.token));
  dispatch(setAuthUser(data.user));
  dispatch(setAuthLoggedStatus(true));
  dispatch(setAuthDBStatus(false));
};

const SignInScreen = ({ setData, ...props }) => {
  // Configure FirebaseUI.
  const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
    signInSuccessUrl: '/',
    // We will display Google and Facebook as auth providers.
    signInOptions: [
      {
        provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
        signInMethod: firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
        //   firebase.auth.EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD,
        emailLinkSignIn: function () {
          return {
            // Additional state showPromo=1234 can be retrieved from URL on
            // sign-in completion in signInSuccess callback by checking
            // window.location.href.
            url: 'https://www.example.com/completeSignIn',
            // Custom FDL domain.
            dynamicLinkDomain: 'example.page.link',
            // Always true for email link sign-in.
            handleCodeInApp: true,
            // Whether to handle link in iOS app if installed.
            iOS: {
              bundleId: 'com.example.ios',
            },
            // Whether to handle link in Android app if opened in an Android
            // device.
            android: {
              packageName: 'com.example.android',
              installApp: true,
              minimumVersion: '12',
            },
          };
        },
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
            console.log('sign popup');
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

        //dispatch(setAuthUser(localStorageService.getUser()));
        //dispatch(setAuthToken(localStorageService.getToken()));
        //handleUserTokenRefresh(user);

        // console.log(firebase.auth().currentUser, 'LoggedSuccess');
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
        console.log(cred);
        // Copy data from anonymous user to permanent user and delete anonymous
        // user.
        // ...
        // Finish sign-in after data is copied.
        return firebase.auth().signInWithCredential(cred);
      },
    },
  };

  const [isSignedIn, setIsSignedIn] = useState(false); // Local signed-in state.

  useEffect(() => {
    const unregisterAuthObserver = firebase
      .auth()
      .onAuthStateChanged((user) => {
        console.log('login dialog started');
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
    return <Redirect to="/main" />;
    // return (
    //   <div style={{ marginLeft: '10px' }}>
    //     <h4>Добро пожаловать в приложение</h4>
    //     <p>{firebase.auth().currentUser.displayName}!</p>
    //     <a onClick={() => firebase.auth().signOut()}>Sign-out</a>
    //   </div>
    // );
  }
};

const CustomLoginForm = ({ ...props }) => {
  React.useEffect(()=>{
    document.querySelector('.MuiButton-label').textContent='ВОЙТИ';
    document.querySelector('#username-label').textContent='Пользователь';
    document.querySelector('#password-label').textContent='Пароль';

    return ()=>{}
  },[])
  return (
    <div>
      <div style={{ fontFamily: 'monospace', marginLeft: '15px' }}>
        <p>Пользователь: test@example.com</p>
        <p>Пароль: password</p>
      </div>
      <LoginForm {...props} />
      <SignInScreen {...props} />
      <ForgotPasswordButton />
    </div>
  );
};

const CustomLoginPage = ({ ...props }) => (
  <Login {...props}>
    <CustomLoginForm {...props} />
  </Login>
);

export default CustomLoginPage;
