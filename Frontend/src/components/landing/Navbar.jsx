import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const sections = ["home", "features", "about", "contact"];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        root: null,
        rootMargin: "-50% 0px -50% 0px",
        threshold: 0,
      }
    );

    sections.forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const navLinkClass = (section) =>
    `relative pb-1 transition-all duration-300 ${
      activeSection === section
        ? "text-blue-600 font-semibold"
        : "text-gray-600 hover:text-black"
    }`;

  return (
    <nav className="w-full bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 text-white flex items-center justify-center rounded-md font-bold">
            T
          </div>
          <span className="text-2xl font-bold text-gray-900">
            TaskFlow
          </span>
        </Link>

        {/* Navigation */}
        <div className="hidden md:flex items-center gap-8 font-medium">
          
          {["home", "features", "about", "contact"].map((section) => (
            <HashLink
              key={section}
              smooth
              to={`/#${section}`}
              className={navLinkClass(section)}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}

              {/* Underline */}
              <span
                className={`absolute left-0 -bottom-1 h-0.5 bg-blue-600 transition-all duration-300 ${
                  activeSection === section ? "w-full" : "w-0"
                }`}
              ></span>
            </HashLink>
          ))}

        </div>

        {/* Auth */}
        <div className="flex items-center gap-4">
          <Link to="/signin" className="text-gray-600 hover:text-black">
            Log in
          </Link>

          <Link
            to="/signup"
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;