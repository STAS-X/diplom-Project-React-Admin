import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Title } from 'react-admin';
import {useHistory} from 'react-router-dom';
import DashBoard from './DashBoard';
import { createBrowserHistory } from 'history';

export default ({ history }) => {
  if (history.location.pathname === '/main') {
    return <DashBoard />;
  }
    return (
      <Card>
        <Title title="Not Found" />
        <CardContent>
          <h1>404: Page not found</h1>
        </CardContent>
      </Card>
    );
};
