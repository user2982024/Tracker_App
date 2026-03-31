import { Toaster } from "react-hot-toast";
// import AuthForm from "./components/Auth/AuthForm";
import Navbar from "./components/landing/Navbar";
import HeroSection from "./components/landing/HeroSection";
import Features from "./components/landing/Features";
import WhySection from "./components/landing/WhySection";
import Footer from "./components/landing/Footer";

const App = () => {
  return (
    <>
      <Toaster position="top-right" />
      {/* <AuthForm />  */}
      <Navbar />
      <HeroSection />
      <Features />
      <WhySection />
      <Footer />
    </>
  );
};

export default App;
