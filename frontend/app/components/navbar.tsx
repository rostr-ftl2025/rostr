import React, { useEffect, useState } from "react";
import type { Page } from "~/routes/home";
import { getUserFromJWT } from "~/utils/getToken";
import SignOutButton from "~/components/sign-out-button";

interface NavbarProps {
  onNavigate?: (page: Page) => void;
  onOpenAuth?: (mode: "signin" | "signup") => void;
}

export function Navbar({ onNavigate, onOpenAuth }: NavbarProps) {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [opponentTeamId, setOpponentTeamId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    const info = getUserFromJWT(token ?? "");
    setIsSignedIn(!!info?.userID);
    // read opponentTeamID like GradingDisplayPage
    if (info?.opponentTeamID) setOpponentTeamId(String(info.opponentTeamID));
  }, []);

  const navigateWithParams = (path: string, includeOpponent = false) => {
    // preserve existing query params and optionally add opponentTeamId
    const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
    if (includeOpponent && opponentTeamId) {
      params.set("opponentTeamId", opponentTeamId);
    }
    const search = params.toString();
    const href = search ? `${path}?${search}` : path;
    window.location.href = href;
  };

  if (isSignedIn) {
    // white link style for signed-in page links
    const linkClass =
      "rounded-xl px-4 mx-2 py-2 text-sm font-semibold shadow transition-colors duration-150 " +
      "bg-white text-[#070738] border border-white hover:bg-sky-50 hover:opacity-95 cursor-pointer";

    return (
      <nav className="sticky top-0 bg-[#070738] z-50 px-10">
        <div className="container flex w-full mx-auto items-center justify-between text-white py-5">
          {/* Left: Title */}
          <div className="flex items-center">
            <button
              onClick={() => window.location.reload()}
              className="flex hover:opacity-80 transition-opacity cursor-pointer"
            >
              <span className="tracking-tight text-4xl font-extrabold">rostr.</span>
            </button>
          </div>

          {/* Right: Signed-in page links */}
          <div className="flex items-center gap-4">
            <button onClick={() => navigateWithParams("/team-maker")} className={linkClass}>
              Team Maker
            </button>
            <button onClick={() => navigateWithParams("/grading-display")} className={linkClass}>
              Grading & Line-up Suggestion
            </button>
            {/* include opponentTeamId for Opponent Team */}
            <button onClick={() => navigateWithParams("/opponent-weaknesses", true)} className={linkClass}>
              Opponent Team
            </button>
            {/* include opponentTeamId for Counter Lineup */}
            <button onClick={() => navigateWithParams("/counter-lineup", true)} className={linkClass}>
              Counter Lineup
            </button>
            <button onClick={() => navigateWithParams("/trade-evaluator")} className={linkClass}>
              Trade Analyzer
            </button>
            <SignOutButton />
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 bg-[#070738] z-50 px-10">
      <div className="container flex mx-auto justify-between text-white py-5">
        <button
          onClick={() => window.location.reload()}
          className="flex hover:opacity-80 transition-opacity cursor-pointer"
        >
          <span className="tracking-tight text-4xl font-extrabold">rostr.</span>
        </button>

        <div className="flex gap-10 text-lg font-medium">
          <button
            className="hover:opacity-80 transition-all cursor-pointer"
            onClick={() => {
              const el = document.getElementById("home");
              if (el) {
                // Account for sticky navbar height so section isn't hidden
                const nav = document.querySelector("nav");
                const navHeight = nav ? nav.getBoundingClientRect().height : 0;
                const top =
                  el.getBoundingClientRect().top + window.pageYOffset - navHeight - 8;
                window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
              } else {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
              onNavigate?.("home");
            }}
          >
            Home
          </button>
          <button
            className="hover:opacity-80 transition-all cursor-pointer"
            onClick={() => {
              // Switch to home page then scroll to section after render
              onNavigate?.("home");
              setTimeout(() => {
                const sectionId = "about";
                const el = document.getElementById(sectionId);
                if (el) {
                  const nav = document.querySelector("nav");
                  const navHeight = nav ? nav.getBoundingClientRect().height : 0;
                  const top =
                    el.getBoundingClientRect().top + window.pageYOffset - navHeight - 8;
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
              onNavigate?.("home");
              setTimeout(() => {
                const sectionId = "how-it-works";
                const el = document.getElementById(sectionId);
                if (el) {
                  const nav = document.querySelector("nav");
                  const navHeight = nav ? nav.getBoundingClientRect().height : 0;
                  const top =
                    el.getBoundingClientRect().top + window.pageYOffset - navHeight - 8;
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
              if (onOpenAuth) onOpenAuth("signin");
              else onNavigate?.("auth");
            }}
            className="hover:opacity-80 transition-all cursor-pointer"
          >
            Sign In
          </button>
          <button
            onClick={() => {
              if (onOpenAuth) onOpenAuth("signup");
              else onNavigate?.("auth");
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
