import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Admin, Resource, defaultTheme, useLogout } from 'react-admin';

import UserIcon from '@material-ui/icons/People';
import CommentIcon from '@material-ui/icons/Comment';
import TaskIcon from '@material-ui/icons/Pages';

import { getAppTheme, getAppTitle } from './store/appcontext';
import { getLoggedStatus } from './store/authcontext';

import merge from 'lodash/merge';

import indigo from '@material-ui/core/colors/indigo';
import pink from '@material-ui/core/colors/pink';
import red from '@material-ui/core/colors/red';

import { CommentList } from './components/page/comments/comments.list';
import { CommentShow } from './components/page/comments/comments.show';
import { CommentEdit } from './components/page/comments/comments.edit';
import { CommentCreate } from './components/page/comments/comments.create';

import { TaskList } from './components/page/tasks/tasks.list';
import { TaskShow } from './components/page/tasks/tasks.show';
import { TaskEdit } from './components/page/tasks/tasks.edit';
import { TaskCreate } from './components/page/tasks/tasks.create';

import { UserList } from './components/page/users/users.list';
import { UserShow } from './components/page/users/users.show';
import { UserEdit } from './components/page/users/users.edit';

import CustomLayout from './components/common/custom/customLayout';
//import { CustomAppConsumer } from './components/common/context/themProvider';

import CustomLoginPage from './components/ui/CustomLoginPage';
// import MyAppBar from './components/common/custom/MyAppBar';

import DashBoardPage from './components/ui/DashBoardPage';
import NotFound from './components/ui/NotFound';

// const MyLayout = ({ children, ...props }) => (
//   <Layout {...props} appBar={MyAppBar}>
//     <h1>React Admin sample</h1>
//     {children}
//   </Layout>
// );

const App = (props) => {
  const theme = useSelector(getAppTheme());
  const mainAppPage = useSelector(getAppTitle());
  const loggedStatus = useSelector(getLoggedStatus());

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

  useEffect(() => {
    const switchToAppPage = (currentPage) => {
      if (!loggedStatus) return '/login';
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

    props.history.replace(switchToAppPage(mainAppPage));

    return () => {};
  }, []);

  //const isLogged = useSelector(getLoggedStatus());

  return (
    <Admin
      authProvider={props.authProvider}
      dataProvider={props.dataProvider}
      theme={changeTheme(theme)}
      layout={CustomLayout}
      loginPage={CustomLoginPage}
      dashboard={DashBoardPage}
      history={props.history}
      catchAll={NotFound}
    >
      <Resource
        name="users"
        icon={UserIcon}
        list={UserList}
        show={UserShow}
        edit={UserEdit}
      />
      <Resource
        name="tasks"
        icon={TaskIcon}
        list={TaskList}
        show={TaskShow}
        create={TaskCreate}
        edit={TaskEdit}
      />
      <Resource
        name="comments"
        icon={CommentIcon}
        list={CommentList}
        show={CommentShow}
        create={CommentCreate}
        edit={CommentEdit}
      />
    </Admin>
  );
};

export default App;
