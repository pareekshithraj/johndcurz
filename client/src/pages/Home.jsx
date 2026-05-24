import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Plans, { FALLBACK_PLANS, normalizePlans } from '../components/Plans';
import Services from '../components/Services';
import Achievements from '../components/Achievements';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import BookingModal from '../components/BookingModal';
import api from '../api';

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    api.get('/plans')
      .then(r => setPlans(normalizePlans(r.data?.length ? r.data : FALLBACK_PLANS)))
      .catch(() => setPlans(normalizePlans(FALLBACK_PLANS)));
  }, []);

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

  const openBooking = (plan = null) => {
    setSelectedPlan(plan);
    setModalOpen(true);
  };

  return (
    <>
      <Navbar onBookNow={() => openBooking()} />
      <Hero onBookNow={() => openBooking()} />
      <About />
      <Plans onBookPlan={(plan) => openBooking(plan)} />
      <Services />
      <Achievements />
      <Testimonials />
      <Contact />
      <Footer />
      <BookingModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        selectedPlan={selectedPlan}
        plans={plans}
      />
    </>
  );
}
