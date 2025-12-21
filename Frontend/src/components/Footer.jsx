import {
  LuSquare,
  LuGithub,
  LuTwitter,
  LuLinkedin,
  LuInstagram,
} from "react-icons/lu";

const Footer = () => {
  return (
    <footer className="bg-linear-to-b from-slate-900 to-slate-950 text-gray-400">
      <div className="mx-auto max-w-7xl px-6 py-12">
        
        {/* TOP GRID */}
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-5">
          
          {/* BRAND */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 text-white">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600">
                <LuSquare />
              </div>
              <span className="text-xl font-semibold">TaskFlow</span>
            </div>

            <p className="mt-4 max-w-sm text-sm leading-relaxed">
              Your all-in-one productivity companion for notes, todos,
              goals, and habits.
            </p>
          </div>

          {/* PRODUCT */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">
              Product
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="cursor-pointer hover:text-white">Notes</li>
              <li className="cursor-pointer hover:text-white">Todos</li>
              <li className="cursor-pointer hover:text-white">Goals</li>
              <li className="cursor-pointer hover:text-white">Habits</li>
            </ul>
          </div>

          {/* COMPANY */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">
              Company
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="cursor-pointer hover:text-white">About</li>
              <li className="cursor-pointer hover:text-white">Blog</li>
              <li className="cursor-pointer hover:text-white">Careers</li>
              <li className="cursor-pointer hover:text-white">Contact</li>
            </ul>
          </div>

          {/* LEGAL */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">
              Legal
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="cursor-pointer hover:text-white">Privacy</li>
              <li className="cursor-pointer hover:text-white">Terms</li>
              <li className="cursor-pointer hover:text-white">Security</li>
            </ul>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="my-6 h-px bg-white/10" />

        {/* BOTTOM BAR */}
        <div className="flex flex-col items-center justify-between gap-6 text-sm sm:flex-row">
          <p>© 2024 TaskFlow. All rights reserved.</p>

          {/* SOCIAL ICONS */}
          <div className="flex items-center gap-4 text-gray-500">
            <a className="transition hover:text-white" href="#">
              <LuGithub size={20} />
            </a>
            <a className="transition hover:text-white" href="#">
              <LuTwitter size={20} />
            </a>
            <a className="transition hover:text-white" href="#">
              <LuLinkedin size={20} />
            </a>
            <a className="transition hover:text-white" href="#">
              <LuInstagram size={20} />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
