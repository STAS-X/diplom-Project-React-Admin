import React from 'react';
import { useSelector } from 'react-redux';
import { Admin, Resource, defaultTheme, localStorageStore } from 'react-admin';

import UserIcon from '@material-ui/icons/People';
import CommentIcon from '@material-ui/icons/Comment';
import PostIcon from '@material-ui/icons/PostAdd';

import { getAppTheme } from './store/appcontext';

import merge from 'lodash/merge';

import indigo from '@material-ui/core/colors/indigo';
import pink from '@material-ui/core/colors/pink';
import red from '@material-ui/core/colors/red';

import {
  PostList,
  PostShow,
  PostCreate,
  PostEdit,
} from './components/page/posts/posts';
import {
  UserList,
  UserShow,
  UserCreate,
  UserEdit,
} from './components/page/users/users';

import CustomLayout from './components/common/custom/customLayout';
//import { CustomAppConsumer } from './components/common/context/themProvider';

import CustomLoginPage from './components/ui/CustomLoginPage';

// import MyAppBar from './components/common/custom/MyAppBar';

import Dashboard from './components/ui/DashBoard';
import NotFound from './components/ui/NotFound';

// const MyLayout = ({ children, ...props }) => (
//   <Layout {...props} appBar={MyAppBar}>
//     <h1>React Admin sample</h1>
//     {children}
//   </Layout>
// );

const App = (props) => {
  const theme = useSelector(getAppTheme());

  const changeTheme = (theme) => {
    if (theme === 'light') {
      return merge({}, defaultTheme, {
        palette: {
          type: `${theme}`,
          primary: indigo,
          secondary: pink,
          error: red,
          contrastThreshold: 3,
          tonalOffset: 0.2,
        },
        typography: {
          // Use the system font instead of the default Roboto font.
          fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Arial',
            'sans-serif',
          ].join(','),
        },
      });
    }

    return merge({}, defaultTheme, {
      palette: {
        type: `${theme}`,
        primary: indigo,
        secondary: pink,
        error: red,
        contrastThreshold: 6,
        tonalOffset: 0.6,
      },
    });
  };
  //const isLogged = useSelector(getLoggedStatus());

  //if (props.history.location.pathname==='/') props.history.replace('/main');

  return (
       <Admin
        authProvider={props.authProvider}
        dataProvider={props.dataProvider}
        theme={changeTheme(theme)}
        layout={CustomLayout}
        loginPage={CustomLoginPage}
        dashboard={Dashboard}
        history={props.history}
        catchAll={NotFound}
      >
        <Resource
          name="users"
          icon={UserIcon}
          list={UserList}
          show={UserShow}
          create={UserCreate}
          edit={UserEdit}
        />
        <Resource
          name="posts"
          icon={PostIcon}
          list={PostList}
          show={PostShow}
          create={PostCreate}
          edit={PostEdit}
        />
      </Admin>
  );
};

export default App;
