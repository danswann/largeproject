import React from 'react';
// import { HomePage, AboutPage, ContactPage } from './';
import HomePage from './homepage';
import AboutPage from './aboutpage';
import ContactPage from './contactpage';

const Main = () => (
	<main>
		<HomePage/>
		<AboutPage />
		<ContactPage />
	</main>
);

export default Main;