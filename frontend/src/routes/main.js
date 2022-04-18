import React from 'react';
// import { HomePage, AboutPage, ContactPage } from './';
import HomePage from './homepage';
import DownloadPage from './downloadpage';
import ContactPage from './contactpage';

const Main = () => (
	<main>
		<HomePage />
		<DownloadPage />
		<ContactPage />
	</main>
);

export default Main;