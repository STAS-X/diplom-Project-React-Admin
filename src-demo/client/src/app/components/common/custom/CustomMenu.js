import * as React from 'react';
import { connect, useSelector, useDispatch } from 'react-redux';
import { Menu, MenuItemLink, getResources } from 'react-admin';
import DefaultIcon from '@material-ui/icons/ViewList';
import { setAppTitle } from '../../../store/appcontext';
// import LabelIcon from '@material-ui/icons/Label';

const CustomSideBar = (props) => {
  const dispatch =  useDispatch();
  const resources = useSelector((state)=>getResources(state));
  const open = useSelector((state) => state.admin.ui.sidebarOpen);
  //if (!resources) return (<div> loading </div>)
  return (
    <Menu {...props}>
      <MenuItemLink
        key={'Main'}
        to='/main'
        primaryText={'Главная страница'}
        leftIcon={<DefaultIcon />}
        onClick={() => {dispatch(setAppTitle('Главная страница'));props.onMenuClick;}}
        sidebarIsOpen={open}
      />
      {resources.map((resource) => (
        <MenuItemLink
          key={resource.name}
          to={`/${resource.name}`}
          primaryText={
            resource.name === 'users'
              ? 'Пользователи'
              : resource.name === 'posts'
              ? 'Посты'
              : 'Задачи'
          }
          leftIcon={resource.icon ? <resource.icon /> : <DefaultIcon />}
          onClick={ () => {dispatch(setAppTitle(resource.name === 'users'
              ? 'Пользователи'
              : resource.name === 'posts'
              ? 'Посты'
              : 'Задачи'));props.onMenuClick;}}
          sidebarIsOpen={open}
        />
      ))}
      {/* add your custom menus here */}
    </Menu>
  );
};
export default CustomSideBar;
