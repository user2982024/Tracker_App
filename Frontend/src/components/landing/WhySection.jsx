import React from "react";
import { Cloud, ShieldCheck, Laptop, Zap } from "lucide-react";

const benefits = [
  {
    icon: <Cloud className="w-6 h-6 text-blue-500" />,
    title: "Cloud Sync",
    description: "Access your data anywhere, anytime",
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-green-500" />,
    title: "100% Secure",
    description: "Your data is protected with encryption",
  },
  {
    icon: <Laptop className="w-6 h-6 text-indigo-500" />,
    title: "Multi-Platform",
    description: "iOS, Android & Web supported",
  },
  {
    icon: <Zap className="w-6 h-6 text-yellow-500" />,
    title: "Lightning Fast",
    description: "Super quick and intuitive to use",
  },
];

const WhySection = () => {
  return (
    <section id="about" className="w-full bg-linear-to-r from-white-50 to-blue-200 py-20 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-6 text-center">

        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          Why Choose Task Flow?
        </h2>

        {/* Cards */}
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

          {benefits.map((item, index) => (
            <div
              key={index}
              className="bg-gray-50 p-6 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition"
            >
              {/* Icon */}
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-white mx-auto shadow-sm">
                {item.icon}
              </div>

              {/* Title */}
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                {item.title}
              </h3>

              {/* Description */}
              <p className="mt-2 text-sm text-gray-600">
                {item.description}
              </p>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
};

export default WhySection;