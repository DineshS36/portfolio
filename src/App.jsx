import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Components
import Preloader from './components/Preloader';
import Layout from './components/Layout';
import Hero from './components/Hero';
import About from './components/About';
import Work from './components/Work';
import Skills from './components/Skills';
import Timeline from './components/Timeline';
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
          <Route path="timeline" element={<Timeline />} />
          <Route path="contact" element={<Contact />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
