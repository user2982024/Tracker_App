

const HeroSection = () => {
  return (
    <section id="home" className="w-full bg-linear-to-r from-white-50 to-blue-200 pt-16 pb-20">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">

        {/* LEFT CONTENT */}
        <div>
          {/* Heading */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Organize your work. <br />
            <span className="text-blue-600">Stay focused.</span>
          </h1>

          {/* Subtext */}
          <p className="mt-6 text-lg text-gray-600 max-w-lg">
            All-in-one productivity app to manage your tasks, goals, notes, and habits — all in one place.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex items-center gap-4">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition">
              Get Started
            </button>

            <button className="flex items-center gap-2 px-6 py-3 border rounded-lg text-gray-700 hover:bg-gray-100 transition">
              ▶ Watch Demo
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-gray-500">
            <span>✔ No credit card required</span>
            <span>✔ Free forever</span>
            <span>✔ Works on all devices</span>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="relative">
          <img
            src="assets/hero-image.png"
            alt="App Preview"
            className="w-full max-w-xl mx-auto"
          />
        </div>

      </div>
    </section>
  );
};

export default HeroSection;