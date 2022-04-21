import { render } from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import App from './App';
import SpotifyConnect from './routes/spotifyconnect';
import PasswordVerification from './routes/passwordverification';
import EmailConnect from './routes/emailverification';

const rootElement = document.getElementById('root');
render (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/spotifyconnect/success" element={<SpotifyConnect success={true} />} />
      <Route path="/spotifyconnect/failure" element={<SpotifyConnect success={false} />} />
      <Route path="/passwordverification/success" element={<PasswordVerification success={true} />} />
      <Route path="/passwordverification/failure" element={<PasswordVerification success={false} />} />
      <Route path="/emailverification/success" element={<EmailConnect success={true} />} />
      <Route path="/emailverification/failure" element={<EmailConnect success={false} />} />
    </Routes>
  </BrowserRouter>,
  rootElement
);