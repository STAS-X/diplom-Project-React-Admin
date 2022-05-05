import * as React from 'react';
import { connect, useSelector, useDispatch } from 'react-redux';
import { Menu, MenuItemLink, getResources } from 'react-admin';
import DefaultIcon from '@material-ui/icons/ViewList';
import ProjectIcon from '@material-ui/icons/HelpRounded';
import { setAppTitle } from '../../../store/appcontext';
// import LabelIcon from '@material-ui/icons/Label';

const CustomSideBar = (props) => {
  const dispatch =  useDispatch();
  const resources = useSelector((state)=>getResources(state));
  const isOpen = useSelector((state) => state.admin.ui.sidebarOpen);
  //if (!resources) return (<div> loading </div>)
  return (
    <Menu {...props}>
      <MenuItemLink
        key={'Main'}
        to="/main"
        primaryText={'Главная страница'}
        leftIcon={<DefaultIcon />}
        onClick={() => {
          dispatch(setAppTitle('Главная страница'));
          props.onMenuClick;
        }}
        sidebarIsOpen={isOpen}
      />
      {resources.map((resource) => (
        <MenuItemLink
          key={resource.name}
          to={`/${resource.name}`}
          primaryText={
            resource.name === 'users'
              ? 'Пользователи'
              : resource.name === 'tasks'
              ? 'Задачи'
              : resource.name === 'comments'
              ? 'Комментарии'
              : 'О проекте'
          }
          leftIcon={resource.icon ? <resource.icon /> : <DefaultIcon />}
          onClick={() => {
            dispatch(
              setAppTitle(
                resource.name === 'users'
                  ? 'Пользователи'
                  : resource.name === 'tasks'
                  ? 'Задачи'
                  : 'Комментарии'
              )
            );
            props.onMenuClick;
          }}
          sidebarIsOpen={isOpen}
        />
      ))}
      <MenuItemLink
        key={'Project'}
        to="/project"
        primaryText={'О проекте'}
        leftIcon={<ProjectIcon />}
        onClick={() => {
          dispatch(setAppTitle('О проекте'));
          props.onMenuClick;
        }}
        sidebarIsOpen={isOpen}
      />
      {/* add your custom menus here */}
    </Menu>
  );
};
export default CustomSideBar;
