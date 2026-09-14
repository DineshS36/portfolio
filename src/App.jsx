import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Core shell components
import Preloader from './components/Preloader';
import Layout from './components/Layout';
import Hero from './components/Hero';

import About from './components/About';
import Work from './components/Work';
import Skills from './components/Skills';
import Contact from './components/Contact';

export default function App() {
  const [isPreloaderDone, setIsPreloaderDone] = useState(
    () => typeof window !== 'undefined' && sessionStorage.getItem('preloaderDone') === 'true'
  );

  return (
    <BrowserRouter>
      {/* High-tech preloader (runs once per session) */}
      <Preloader onLoaded={() => setIsPreloaderDone(true)} />

      <Routes>
        <Route path="/" element={<Layout isPreloaderDone={isPreloaderDone} />}>
          <Route index element={<Hero />} />
          <Route path="about" element={<About />} />
          <Route path="work" element={<Work />} />
          <Route path="skills" element={<Skills />} />
          <Route path="timeline" element={<Navigate to="/about" replace />} />
          <Route path="contact" element={<Contact />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
