import { useState, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Core shell components
import Preloader from './components/Preloader';
import Layout from './components/Layout';
import Hero from './components/Hero';

// Route-level code splitting for high performance
const About = lazy(() => import('./components/About'));
const Work = lazy(() => import('./components/Work'));
const Skills = lazy(() => import('./components/Skills'));
const Timeline = lazy(() => import('./components/Timeline'));
const Contact = lazy(() => import('./components/Contact'));

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
