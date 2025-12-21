import React from "react";

const MainScreen_1 = () => {
  return (
    <>
      <section className="bg-purple-50">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center text-center">
          {/* Tagline */}
          <div className="bg-purple-200 text-purple-600 rounded-2xl px-6 py-2 hover:bg-purple-400 mb-6">
            <p className="font-medium">Your All-in-One Productivity Hub</p>
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-purple-500">
            Organize Your Life,
          </h1>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-black mb-4">
            Achieve Your Dreams
          </h1>

          {/* Description */}
          <p className="text-gray-700 text-base sm:text-lg md:text-xl max-w-3xl mb-8 px-2 sm:px-0">
            Track notes, manage todos, set goals, and build daily habits all in
            one beautiful, intuitive platform designed to help you succeed.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button className="bg-purple-600 text-white cursor-pointer font-bold px-6 py-3 rounded-lg hover:bg-purple-500 transition">
              Get Started
            </button>
            <button className="bg-white text-black font-bold px-6 py-3 rounded-lg border-2 border-gray-700 hover:bg-gray-100 transition">
              Learn More
            </button>
          </div>

          {/* Hero Image */}
          <div className="w-full max-w-3xl">
            <img
              src="1.png"
              alt="Hero"
              className="w-full h-auto rounded-lg shadow-md"
            />
          </div>
        </div>
      </section>
      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
          Everything You Need to Stay Productive
        </h2>
        <p className="text-gray-700 text-base sm:text-lg md:text-xl max-w-2xl mx-auto">
          Powerful tools working together to help you organize, plan, and
          achieve more every day.
        </p>
      </div>
    </>
  );
};

export default MainScreen_1;
