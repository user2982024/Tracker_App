import Navbar from "../components/landing/Navbar";
import HeroSection from "../components/landing/HeroSection";
import FeaturesSection from "../components/landing/Features";
import WhySection from "../components/landing/WhySection";
import Footer from "../components/landing/Footer";

const LandingPage = () => {
  return (
    <div className="bg-background text-foreground">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Productivity Section */}
      <FeaturesSection />

      {/* Why Section */}
      <WhySection />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
