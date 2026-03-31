import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";

const Navbar = () => {
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
        <div className="hidden md:flex items-center gap-8 text-gray-600 font-medium">
          
          <HashLink smooth to="/#home" className="hover:text-black">
            Home
          </HashLink>

          <HashLink smooth to="/#features" className="hover:text-black">
            Features
          </HashLink>

          <HashLink smooth to="/#about" className="hover:text-black">
            About
          </HashLink>

          <HashLink smooth to="/#contact" className="hover:text-black">
            Contact
          </HashLink>

        </div>

        {/* Auth */}
        <div className="flex items-center gap-4">
          <Link to="/signin" className="text-gray-600 hover:text-black">
            Log in
          </Link>

          <Link
            to="/signup"
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;