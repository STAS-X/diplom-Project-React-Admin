import React from 'react';
import { Layout } from 'react-admin';
import CustomAppBar from './MuiSampleAppBar';
import CustomSideBar from './CustomMenu'

const CustomLayout = ({ children, ...props }) => (
  <Layout
    {...props}
    sx={{
      '& > div:nth-of-type(1)': {
        mt:0
      },
    }}
    appBar={CustomAppBar}
    sidebar={CustomSideBar}
  >
    <h1>React Admin sample</h1>
    {children}
  </Layout>
);

export default CustomLayout;
