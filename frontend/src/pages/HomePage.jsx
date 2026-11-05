import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/landing/Hero.jsx';
import DemoDespesas from '../components/landing/DemoDespesas.jsx';
import ComoFunciona from '../components/landing/ComoFunciona.jsx';
import Planos from '../components/landing/Planos.jsx';
import Contato from '../components/landing/Contato.jsx';

export default function HomePage() {
  const { hash } = useLocation();

  // Links do menu usam âncoras (/#planos etc.): rola até a seção ao chegar.
  useEffect(() => {
    if (!hash) return;
    document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
  }, [hash]);

  return (
    <>
      <Hero />
      <DemoDespesas />
      <ComoFunciona />
      <Planos />
      <Contato />
    </>
  );
}
