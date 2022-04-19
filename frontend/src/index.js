import { render } from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import App from './App';
import SpotifyConnect from './routes/spotifyconnect';

const rootElement = document.getElementById('root');
render (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/spotifyconnect/success" element={<SpotifyConnect success={true} />} />
      <Route path="/spotifyconnect/failure" element={<SpotifyConnect success={false} />} />
    </Routes>
  </BrowserRouter>,
  rootElement
);