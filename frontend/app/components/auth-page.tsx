import { useState, useEffect } from "react";
import { handleSubmit } from "~/sign-in-page/api/handleSubmit";

interface AuthModalProps {
  initialMode?: "signin" | "signup";
  onClose: () => void;
  onGoToHomeSection?: (sectionId: 'about' | 'how-it-works') => void;
}

export function AuthModal({ initialMode = "signup", onClose, onGoToHomeSection }: AuthModalProps) {
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<{ username?: string; userID?: string } | null>(null);

  // Update mode when initialMode prop changes (from navbar clicks)
  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 w-96 transition-all duration-300">
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-2">
          <button
            onClick={() => setMode("signin")}
            className={`px-4 py-2 rounded-l-lg font-semibold border border-black bg-white text-black hover:bg-black hover:text-white transition-colors ${
              mode === "signin" ? "ring-2 ring-black" : ""
            } hover:cursor-pointer`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode("signup")}
            className={`px-4 py-2 rounded-r-lg font-semibold border border-black bg-white text-black hover:bg-black hover:text-white transition-colors ${
              mode === "signup" ? "ring-2 ring-black" : ""
            } hover:cursor-pointer`}
          >
            Sign Up
          </button>
        </div>
        <button
          onClick={onClose}
          className="px-2 py-1 border border-black rounded bg-white text-black hover:bg-black hover:text-white transition-colors hover:cursor-pointer"
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
          className="py-2 rounded-lg font-semibold bg-sky-400 text-white border border-sky-400 hover:bg-sky-500 disabled:opacity-50 transition-opacity duration-200 ease-in-out hover:opacity-90 hover:cursor-pointer"
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
