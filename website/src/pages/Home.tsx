import Hero from '../components/Hero';
import AppShowcase from '../components/AppShowcase';
import WhatItIs from '../components/WhatItIs';
import HowItWorks from '../components/HowItWorks';
import WhyItMatters from '../components/WhyItMatters';
import Audiences from '../components/Audiences';
import CallToAction from '../components/CallToAction';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen font-sans selection:bg-lavender selection:text-white">
      <Hero />

      <div className="relative z-10 bg-cream">
        <AppShowcase />
        <WhatItIs />
        <HowItWorks />
        <WhyItMatters />
        <Audiences />
        <CallToAction />
        <Footer />
      </div>
    </div>
  );
}
