import { render } from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import App from './App';
import SpotifyConnect from './routes/spotifyconnect';
import PasswordValidation from './routes/passwordvalidation';
import EmailConnect from './routes/emailverification';

const rootElement = document.getElementById('root');
render (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/spotifyconnect/success" element={<SpotifyConnect success={true} />} />
      <Route path="/spotifyconnect/failure" element={<SpotifyConnect success={false} />} />
      <Route path="/passwordvalidation/success" element={<PasswordValidation success={true} />} />
      <Route path="/passwordvalidation/failure" element={<PasswordValidation success={false} />} />
      <Route path="/emailverification/success" element={<EmailConnect success={true} />} />
      <Route path="/emailverification/failure" element={<EmailConnect success={false} />} />
    </Routes>
  </BrowserRouter>,
  rootElement
);