import { LuCloud, LuSmartphone, LuLock } from "react-icons/lu";

const features = [
  {
    icon: <LuCloud />,
    title: "Real-time Sync",
    description:
      "Access your data anywhere, anytime with seamless cloud synchronization.",
  },
  {
    icon: <LuSmartphone />,
    title: "Mobile Optimized",
    description:
      "Beautiful, responsive design that works perfectly on all your devices.",
  },
  {
    icon: <LuLock />,
    title: "Secure & Private",
    description:
      "Your data is encrypted and protected with industry-leading security.",
  },
];

const MainScreen_2 = () => {
  return (
    <>
      <section className="bg-[#faf7ff] py-20 px-4">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            {/* LEFT CONTENT */}
            <div>
              <span className="inline-flex items-center rounded-full bg-purple-100 px-4 py-1 text-sm font-medium text-purple-600">
                Powerful Features
              </span>

              <h2 className="mt-4 text-4xl font-bold text-gray-900 leading-tight">
                Why Choose <span className="text-purple-600">TaskFlow?</span>
              </h2>

              <p className="mt-4 max-w-xl text-gray-600">
                Experience productivity tools designed with your success in
                mind.
              </p>

              {/* FEATURES LIST */}
              <div className="mt-10 space-y-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-4">
                    {/* ICON */}
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600 text-white text-xl">
                      {feature.icon}
                    </div>

                    {/* TEXT */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">
                        {feature.title}
                      </h4>
                      <p className="mt-1 text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT IMAGE */}
            <div className="relative">
              <div className="overflow-hidden rounded-2xl shadow-xl">
                <img
                  src="/2.png"
                  alt="TaskFlow Dashboard"
                  className="w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="text-center my-8 md:my-12">
        <h1 className="font-semibold text-2xl">Trusted by Productive People</h1>
        <p className="text-gray-600 my-2">Transform your productivity with TaskFlow</p>
      </div>
    </>
  );
};

export default MainScreen_2;
