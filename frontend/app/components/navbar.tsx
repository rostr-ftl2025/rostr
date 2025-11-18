import type { Page } from "~/routes/home";

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onOpenAuth?: (mode: "signin" | "signup") => void;
  onGradeClick?: () => void;
}

export function Navbar({ currentPage, onNavigate, onOpenAuth, onGradeClick }: NavbarProps) {
  return (
    <nav className="sticky top-0 bg-[#070738] z-50">
      <div className="container flex mx-auto justify-between text-white py-5">
        <button
          onClick={() => window.location.reload()}
          className="flex hover:opacity-80 transition-opacity cursor-pointer"
        >
          <span className="tracking-tight text-4xl font-extrabold">Rostr.</span>
        </button>

        <div className="flex gap-10 text-lg font-medium">
          <button
            className="hover:opacity-80 transition-all cursor-pointer"
            onClick={() => {
              const el = document.getElementById("home");
              if (el) {
                // Account for sticky navbar height so section isn't hidden
                const nav = document.querySelector('nav');
                const navHeight = nav ? nav.getBoundingClientRect().height : 0;
                const top = el.getBoundingClientRect().top + window.pageYOffset - navHeight - 8;
                window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
              } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
              onNavigate("home");
            }}
          >
            Home
          </button>
          <button
            className="hover:opacity-80 transition-all cursor-pointer"
            onClick={() => {
              // Switch to home page then scroll to section after render
              onNavigate("home");
              setTimeout(() => {
                const sectionId = "about";
                const el = document.getElementById(sectionId);
                if (el) {
                  const nav = document.querySelector("nav");
                  const navHeight = nav ? nav.getBoundingClientRect().height : 0;
                  const top = el.getBoundingClientRect().top + window.pageYOffset - navHeight - 8;
                  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
                } else {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }, 50);
            }}
          >
            About
          </button>
          <button
            className="hover:opacity-80 transition-all cursor-pointer"
            onClick={() => {
              onNavigate("home");
              setTimeout(() => {
                const sectionId = "how-it-works";
                const el = document.getElementById(sectionId);
                if (el) {
                  const nav = document.querySelector("nav");
                  const navHeight = nav ? nav.getBoundingClientRect().height : 0;
                  const top = el.getBoundingClientRect().top + window.pageYOffset - navHeight - 8;
                  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
                } else {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }, 50);
            }}
          >
            How It Works
          </button>
          <button
            onClick={() => {
              if (onOpenAuth) onOpenAuth('signin');
              else onNavigate('auth');
            }}
            className="hover:opacity-80 transition-all cursor-pointer"
          >
            Sign In
          </button>
          <button
            onClick={() => {
              if (onOpenAuth) onOpenAuth('signup');
              else onNavigate('auth');
            }}
            className="px-6 py-2 rounded-full bg-white text-[#070738] hover:opacity-80 transition-all duration-200 cursor-pointer"
          >
            Sign Up
          </button>
        </div>
      </div>
    </nav>
  );
}
