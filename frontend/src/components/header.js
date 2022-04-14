import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { AppBar, IconButton, Toolbar } from '@material-ui/core';
import SortIcon from 'material-ui/icons/Sort';

const useStyles = makeStyles((theme) => ({
    appBar: {
        background: 'none',
        fontFamily: "Poppins",
    },

    appBarWrapper: {
        width: '80%',
        margin: '0 auto',
    },

    appBarTitle: {
        flexGrow: 1,
    },

}));

function Header() {
  const classes = useStyles();
  return (
    <div>
        <AppBar className={classes.appBar} elevation={0}>
            <Toolbar className={classes.appBarWrapper}>
                <h1 className={classes.appBarTitle}>Soundlink</h1>
                <IconButton>
                    <SortIcon className={classes.icon} />
                </IconButton>
            </Toolbar>            
        </AppBar>
    </div>
  );
}

export default Header;
