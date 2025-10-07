import React, { useState } from "react";
import type { FormEvent } from "react";
import { API_URL } from "~/config";

interface SignUpModalProps {
  onClose: () => void;
}

export function SignUpModal({ onClose }: SignUpModalProps) {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  async function handleSignUp(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch(`${API_URL}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username, password: password }),
      });

      const data = await res.json();
      if (res.ok) setMessage("✅ Account created successfully!");
      else setMessage("❌ " + (data.error || "Something went wrong"));
    } catch (err) {
      console.log(err)
      setMessage("❌ Network error");
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-96 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Sign Up</h2>
        <form onSubmit={handleSignUp} className="flex flex-col space-y-3">
          <input
            className="border rounded-lg px-3 py-2"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="border rounded-lg px-3 py-2"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="bg-[#caffbf] hover:bg-[#b5fbb1] py-2 rounded-lg font-semibold text-gray-800"
            type="submit"
          >
            Sign Up
          </button>
          {message && (
            <p className="text-center text-sm text-gray-600">{message}</p>
          )}
        </form>
      </div>
    </div>
  );
}
