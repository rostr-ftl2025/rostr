import React from "react";

export default function SignOutButton() {
  const handleSignOut = () => {
    localStorage.removeItem("jwtToken");
    window.location.assign("/");
  };

  return (
    <button
      onClick={handleSignOut}
      className="flex gap-10 text-lg font-medium hover:opacity-80 transition-all cursor-pointer"
    >
      Sign Out
    </button>
  );
}