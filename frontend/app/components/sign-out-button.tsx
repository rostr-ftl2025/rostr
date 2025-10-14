import React from "react";

export default function SignOutButton() {
  const handleSignOut = () => {
    localStorage.removeItem("jwtToken");
    window.location.assign("/");
  };

  return (
    <button
      onClick={handleSignOut}
      className="px-4 py-2 rounded-lg bg-gray-300 text-gray-800 font-semibold hover:bg-gray-400 transition"
    >
      Sign Out
    </button>
  );
}