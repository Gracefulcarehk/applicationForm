import React from 'react';
import Hero from '../components/landing/Hero';
import WhyJoin from '../components/landing/WhyJoin';
import Roles from '../components/landing/Roles';
import Requirements from '../components/landing/Requirements';
import Steps from '../components/landing/Steps';
import Benefits from '../components/landing/Benefits';
import CtaBanner from '../components/landing/CtaBanner';
import FAQSection from '../components/FAQSection';

const LandingPage: React.FC = () => (
  <>
    <Hero />
    <WhyJoin />
    <Roles />
    <Requirements />
    <Steps />
    <Benefits />
    <FAQSection />
    <CtaBanner />
  </>
);

export default LandingPage;
