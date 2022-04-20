import React from 'react';
import { Outlet } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import { Nav } from './nav';
import { Main } from './routes';
import NavProvider from './context/NavContext';

function App() {
  return (
    <div>      
			<NavProvider>
        <Outlet />
				<Nav />
				<Main />
			</NavProvider>
    </div>
  );
}

export default App;
