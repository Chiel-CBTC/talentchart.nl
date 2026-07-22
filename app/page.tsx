import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Benefits from "@/components/Benefits";
import PrivacyNote from "@/components/PrivacyNote";
import Testimonial from "@/components/Testimonial";
import SignupForm from "@/components/SignupForm";
import Footer from "@/components/Footer";
import StickyBar from "@/components/StickyBar";

export default function Home() {
  return (
    <main>
      <StickyBar />
      <Hero />
      <HowItWorks />
      <Benefits />
      <PrivacyNote />
      <Testimonial />
      <SignupForm />
      <Footer />
    </main>
  );
}
