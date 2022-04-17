import React from 'react';
import NavLink from './NavLink';
import { navLinks } from './navLinks';
import './Nav.css';

// import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css'

const Nav = () => {
	return (
		<nav>
			<img 
				src="/assets/soundlinklogo.png" 
				width="10%" 
				height="10%" 
				alt=""
				justify-content="start"								
				margin-bottom="10"
			/>
			{navLinks.map(({ navLinkId, scrollToId }, idx) => (
				<NavLink key={idx} navLinkId={navLinkId} scrollToId={scrollToId} />				
			))}			
		</nav>
	);
};

export default Nav;