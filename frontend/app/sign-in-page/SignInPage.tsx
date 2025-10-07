import React, { useState } from "react";
import { SignInModal } from "../components/SignInModal";
import { SignUpModal } from "../components/SignUpModal";

export default function SignInPage() {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#faf8f3] text-center">
      <h1 className="text-6xl font-bold text-[#3b3b3b] mb-10 tracking-wide">
        Rostr<span className="text-[#89c2d9]">.</span>
      </h1>

      <div className="space-x-4">
        <button
          onClick={() => setShowSignIn(true)}
          className="bg-[#562424] hover:bg-[#562424] text-white font-semibold py-2 px-6 rounded-xl shadow-md transition"
        >
          Sign In
        </button>
        <button
          onClick={() => setShowSignUp(true)}
          className="bg-[#caffbf] hover:bg-[#b5fbb1] text-white font-semibold py-2 px-6 rounded-xl shadow-md transition"
        >
          Sign Up
        </button>
      </div>

      {showSignIn && <SignInModal onClose={() => setShowSignIn(false)} />}
      {showSignUp && <SignUpModal onClose={() => setShowSignUp(false)} />}
    </div>
  );
}
