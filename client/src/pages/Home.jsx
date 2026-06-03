import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Plans from '../components/Plans';
import Services from '../components/Services';
import Achievements from '../components/Achievements';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import { openGoogleForm } from '../siteConfig';

export default function Home() {
  useEffect(() => {
    if (!window.location.hash) return;
    const targetId = window.location.hash.slice(1);
    window.setTimeout(() => {
      const target = document.getElementById(targetId);
      if (!target) return;
      const top = target.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top, behavior: 'smooth' });
    }, 100);
  }, []);

  return (
    <>
      <Navbar onBookNow={openGoogleForm} />
      <Hero onBookNow={openGoogleForm} />
      <About />
      <Plans />
      <Services />
      <Achievements />
      <Testimonials />
      <Contact />
      <Footer />
    </>
  );
}
