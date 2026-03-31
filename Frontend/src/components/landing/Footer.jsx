import React from "react";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer id="contact" className="w-full bg-blue-800 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 grid gap-12 md:grid-cols-2 lg:grid-cols-5">

        {/* LEFT SECTION */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 text-white flex items-center justify-center rounded-md font-bold">
              T
            </div>
            <span className="text-xl font-semibold text-white">
              TaskFlow
            </span>
          </div>

          <p className="mt-4 text-sm text-white max-w-md">
            Your all-in-one productivity companion. Organize tasks, goals, notes,
            and habits in one beautiful app.
          </p>

          {/* Social Icons */}
          <div className="mt-6 flex items-center gap-4">
            <Facebook className="w-5 h-5 cursor-pointer" />
            <Twitter className="w-5 h-5 cursor-pointer" />
            <Instagram className="w-5 h-5 cursor-pointer" />
            <Linkedin className="w-5 h-5 cursor-pointer" />
          </div>
        </div>

        {/* PRODUCT */}
        <div>
          <h3 className="text-white font-semibold">Product</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li className="cursor-pointer">Features</li>
            <li className="cursor-pointer">Pricing</li>
            <li className="cursor-pointer">Download</li>
            <li className="cursor-pointer">Changelog</li>
          </ul>
        </div>

        {/* COMPANY */}
        <div>
          <h3 className="text-white font-semibold">Company</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li className="cursor-pointer">About Us</li>
            <li className="cursor-pointer">Blog</li>
            <li className="cursor-pointer">Careers</li>
            <li className="cursor-pointer">Press Kit</li>
          </ul>
        </div>

        {/* SUPPORT */}
        <div>
          <h3 className="text-white font-semibold">Support</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li className="cursor-pointer">Help Center</li>
            <li className="cursor-pointer">Contact Us</li>
            <li className="cursor-pointer">Privacy Policy</li>
            <li className="cursor-pointer">Terms of Service</li>
          </ul>
        </div>

        {/* STAY CONNECTED */}
        <div>
          <h3 className="text-white font-semibold">Stay Connected</h3>
          <p className="mt-4 text-sm text-white">
            Get productivity tips and updates
          </p>

          <div className="mt-4 flex items-center bg-gray-200 rounded-lg overflow-hidden">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 bg-transparent text-sm outline-none text-white placeholder-gray-800"
            />
            <button className="bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
              →
            </button>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="mt-12 border-t border-gray-800 pt-6 text-center text-sm text-white">
        © 2025 TaskFlow. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;