import React from 'react';
import { Layout } from 'react-admin';
import { useSelector } from 'react-redux';
import CustomAppBar from './MuiSampleAppBar';
import CustomSideBar from './CustomMenu'
import { getAppTitle } from '../../../store/appcontext';

const CustomLayout = (currentPage) => ({children, ...props})=> {

 return (
   <Layout
     {...props}
     sx={{
       '& > div:nth-of-type(1)': {
         mt: 0,
       },
     }}
     appBar={CustomAppBar(currentPage)}
     sidebar={CustomSideBar}
   >
     <h1 style={{ marginBottom: '1rem'}}>
       React Admin: <span style={{fontSize: '90%'}}>{currentPage}</span>
     </h1>
     {children}
   </Layout>
 );
};

export default CustomLayout;
