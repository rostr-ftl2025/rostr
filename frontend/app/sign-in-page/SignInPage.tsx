import React, { useState } from "react";
import { AuthModal } from "./AuthModal";

export default function SignInPage() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [initialMode, setInitialMode] = useState<"signin" | "signup">("signin");

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#F5DBD5] text-center">
      <h1 className="text-6xl font-bold text-[#3b3b3b] mb-10 tracking-wide">
        Rostr<span className="text-[#850027]">.</span>
      </h1>

      <div className="space-x-4">
        <button
          onClick={() => {
            setInitialMode("signin");
            setShowAuthModal(true);
          }}
          className="bg-[#562424] hover:bg-[#734343] text-white font-semibold py-2 px-6 rounded-xl shadow-md transition"
        >
          Sign In
        </button>
        <button
          onClick={() => {
            setInitialMode("signup");
            setShowAuthModal(true);
          }}
          className="bg-[#562424] hover:bg-[#734343] text-white font-semibold py-2 px-6 rounded-xl shadow-md transition"
        >
          Sign Up
        </button>
      </div>

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          // Optional: pass which mode to start in
          initialMode={initialMode}
        />
      )}
    </div>
  );
}
