import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Title } from 'react-admin';
import { useHistory } from 'react-router-dom';
import DashBoardPage from './DashBoardPage';
import ProjectPage from './ProjectPage';

export default ({ history }) => {
  switch (history.location.pathname) {
    case '/main':
      return <DashBoardPage />;
    case '/project':
      return <ProjectPage />;
    default:
      return (
        <Card>
          <Title title="Not Found" />
          <CardContent>
            <h1>404: Page not found</h1>
          </CardContent>
        </Card>
      );
  }
};
