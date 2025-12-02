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
  const [currentPageKey, setCurrentPageKey] = useState<string>("");

  useEffect(() => {
    // get user info and opponentTeamID as before
    const token = localStorage.getItem("jwtToken");
    const info = getUserFromJWT(token ?? "");
    setIsSignedIn(!!info?.userID);
    if (info?.opponentTeamID) setOpponentTeamId(String(info.opponentTeamID));

    // determine current page key by extracting the segment between the leading '/'
    // and the optional '?'. We take the first path segment (e.g. 'grading-display').
    if (typeof window !== "undefined") {
      try {
        const originRemoved = window.location.href.replace(window.location.origin, "");
        const beforeQuery = originRemoved.split("?")[0]; // '/grading-display' or '/'
        const trimmed = beforeQuery.replace(/^\/+/, ""); // 'grading-display' or ''
        const firstSegment = trimmed.split("/")[0] || "";
        setCurrentPageKey(firstSegment);
      } catch (e) {
        setCurrentPageKey("");
      }
    }
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
    // Replace the previous pill button styles with plain text link styles that match the signed-out navbar.
    // Active page will show an underline using the existing currentPageKey matching logic.
    const baseClass = "hover:opacity-80 transition-all cursor-pointer text-lg px-3 py-2";
    const inactiveExtras = "text-white font-medium";
    const activeExtras = "text-white underline";

    const btnClassFor = (segments: string | string[]) => {
      const matches = Array.isArray(segments)
        ? segments.includes(currentPageKey)
        : currentPageKey === segments;
      return baseClass + (matches ? ` ${activeExtras}` : ` ${inactiveExtras}`);
    };

    return (
      <nav className="sticky top-0 bg-[#070738] z-50 px-10">
        <div className="container flex w-full mx-auto items-center justify-between text-white py-5">
          {/* Left: Title */}
          <div className="flex items-center">
            <button
              onClick={() => window.location.reload()}
              className="flex hover:opacity-80 transition-opacity cursor-pointer"
            >
              <span className="tracking-tight text-4xl font-extrabold">Rostr.</span>
            </button>
          </div>

          {/* Right: Signed-in page links */}
          <div className="flex items-center gap-10 text-lg font-medium">
            <button onClick={() => navigateWithParams("/team-maker")} className={btnClassFor("team-maker")}>
              Team Maker
            </button>
            <button onClick={() => navigateWithParams("/grading-display")} className={btnClassFor(["grading-display", "lineup-recommendation"])}>
              Starting Rotation
            </button>
            <button onClick={() => navigateWithParams("/opponent-weaknesses", true)} className={btnClassFor("opponent-weaknesses")}>
              Opponent Team
            </button>
            <button onClick={() => navigateWithParams("/counter-lineup", true)} className={btnClassFor("counter-lineup")}>
              Counter Lineup
            </button>
             {/* include TeamId for Counter Lineup */}
            <button onClick={() => navigateWithParams("/trade-evaluator")} className={btnClassFor("trade-evaluator")}>
              Trade Analyzer
              </button>
              <button onClick={() => navigateWithParams("/stats-page")} className={btnClassFor("stats-page")}>
              Baseball Stats Guide
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
          <span className="tracking-tight text-4xl font-extrabold">Rostr.</span>
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
          className="hover:opacity-80 transition-all cursor-pointer"
          onClick={() => navigateWithParams("/stats-page")}
        >
          Baseball Stats Guide
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
