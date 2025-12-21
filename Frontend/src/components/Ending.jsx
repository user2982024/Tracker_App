const Ending = () => {
  return (
    <section className="relative overflow-hidden bg-linear-to-r from-purple-500 to-purple-600 py-16">
      <div className="mx-auto max-w-5xl px-6 text-center text-white">
        
        {/* Heading */}
        <h2 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
          Ready to Transform Your Productivity?
        </h2>

        {/* Subtext */}
        <p className="mx-auto mt-4 max-w-2xl text-base text-purple-100 sm:text-lg">
          Join thousands of users who are achieving more every day with TaskFlow.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          
          {/* Primary Button */}
          <button className="flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 font-semibold text-purple-600 shadow-lg transition hover:scale-105 hover:bg-purple-50">
            Start Today
            <span className="text-sm">→</span>
          </button>

          {/* Secondary Button */}
          <button className="flex items-center justify-center gap-2 rounded-xl border border-white/60 px-8 py-4 font-semibold text-white transition hover:scale-105 hover:bg-white/10">
            Watch Demo
            <span className="text-sm">▶</span>
          </button>
        </div>

        {/* Footer Text */}
        <p className="mt-6 text-sm text-purple-100">
          No credit card required · Free forever plan available
        </p>
      </div>
    </section>
  );
};

export default Ending;
