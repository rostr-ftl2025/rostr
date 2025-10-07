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
  const [loading, setLoading] = useState<boolean>(false);

  function handleSignUp(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    fetch(`${API_URL}/api/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username.trim(),
        password: password.trim(),
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          setMessage("✅ Account created successfully!");
          setUsername("");
          setPassword("");
        } else {
          setMessage("❌ " + (data.error || "Something went wrong"));
        }
      })
      .catch((err) => {
        console.error(err);
        setMessage("❌ Network error");
      })
      .finally(() => {
        setLoading(false);
      });
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
            required
          />
          <input
            className="border rounded-lg px-3 py-2"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            className="bg-[#caffbf] hover:bg-[#b5fbb1] py-2 rounded-lg font-semibold text-gray-800 disabled:opacity-50"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
          {message && (
            <p className="text-center text-sm text-gray-600">{message}</p>
          )}
        </form>
      </div>
    </div>
  );
}
