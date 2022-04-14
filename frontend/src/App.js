import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Outlet } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';

const useStyles = makeStyles((theme) => ({
  root:{
    height: '100vh',
    // backgroundImage:`url(${process.env.PUBLIC_URL + "/assets/bg.jpg'})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    
  },
}));

function App() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <CssBaseline />
      <h1>Soundlink</h1>
      <Outlet />
    </div>
  );
}

export default App;
