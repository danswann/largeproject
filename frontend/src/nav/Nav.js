import React from 'react';
import NavLink from './NavLink';
import { navLinks } from './navLinks';
import './Nav.css';

import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
// import '../App.css'
// marginTop: 8,
const Nav = () => {
	return (
		<nav style={{
			width: "100%", 
			backgroundColor: "#12081A", 
			padding: 0, 
			justifyContent: "space-between",
			marginLeft: -30
			}}>
			<Container style={{width:"70%", alignSelf:"flex-start"}}>			
				<img 
					src="/assets/soundlinklogo.png" 
					width="225px" 
					height="39px" 
					alt=""
					style={{
						alignSelf:"flex-start", 
						marginTop: 7.5,
						backgroundColor:"transparent"				
					}}
				/>
			</Container>
			
			{navLinks.map(({ navLinkId, scrollToId }, idx) => (
				<NavLink key={idx} navLinkId={navLinkId} scrollToId={scrollToId} />				
			))}		
		</nav>
	);
};

export default Nav;