import React, { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { API_URL } from "~/config";
import { getUserFromJWT } from "~/utils/getToken";
import { handleSubmit } from "./api/handleSubmit";

interface AuthModalProps {
  mode?: "signin" | "signup";
  onClose: () => void;
}

export function AuthModal({ mode: initialMode = "signin", onClose }: AuthModalProps) {
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<{ username?: string; userID?: string } | null>(null);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 w-96 transition-all duration-300">
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-2">
          <button
            onClick={() => setMode("signin")}
            className={`px-4 py-2 rounded-l-lg font-semibold ${
              mode === "signin"
                ? "bg-[#562424] text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode("signup")}
            className={`px-4 py-2 rounded-r-lg font-semibold ${
              mode === "signup"
                ? "bg-[#562424] text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Sign Up
          </button>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-lg"
        >
          x
        </button>
      </div>

      <h2 className="text-2xl font-semibold mb-4 text-gray-700 text-center">
        {mode === "signin" ? "Sign In" : "Sign Up"}
      </h2>

      <form
        onSubmit={(e) =>
          handleSubmit(e, {
            mode,
            username,
            password,
            setMessage,
            setLoading,
            setUsername,
            setPassword,
            setUserInfo,
          })
        }
        className="flex flex-col space-y-3"
      >
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
          className={"py-2 rounded-lg font-semibold text-white bg-[#562424] hover:bg-[#734343] disabled:opacity-50"}
          type="submit"
          disabled={loading}
        >
          {loading
            ? mode === "signin"
              ? "Signing In..."
              : "Creating..."
            : mode === "signin"
            ? "Sign In"
            : "Sign Up"}
        </button>

        {message && (
          <p className="text-center text-sm text-gray-600">{message}</p>
        )}
      </form>
    </div>
  );
}
