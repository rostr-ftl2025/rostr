import { useState, useEffect } from "react";
import { X } from "lucide-react";
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
    <div className="min-h-screen flex items-center justify-center bg-[#070738]">
      {/* lift popup slightly to account for sticky navbar */}
      <div className="max-w-md w-full mx-auto transform -translate-y-12 md:-translate-y-16">
         {/* White rounded card */}
         <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
           <div className="flex items-center justify-between mb-4">
             <div className="inline-flex rounded-full bg-slate-100 p-1 shadow-inner">
               <button
                 onClick={() => setMode("signin")}
                 className={`px-4 py-2 rounded-full text-sm font-medium transition cursor-pointer ${
                   mode === "signin"
                     ? "bg-[#070738] text-white shadow-sm"
                     : "text-slate-700 hover:bg-slate-200"
                 }`}
               >
                 Sign In
               </button>
               <button
                 onClick={() => setMode("signup")}
                 className={`ml-1 px-4 py-2 rounded-full text-sm font-medium transition cursor-pointer ${
                   mode === "signup"
                     ? "bg-[#070738] text-white shadow-sm"
                     : "text-slate-700 hover:bg-slate-200"
                 }`}
               >
                 Sign Up
               </button>
             </div>

            <button
              onClick={onClose}
              className="text-[#070738] p-1 rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
           </div>

          <h2 className="text-center text-[#070738] text-2xl font-semibold mb-2">
            {mode === "signin" ? "Welcome back" : "Create your account"}
          </h2>
          <p className="text-center text-slate-600 text-sm mb-4">
            {mode === "signin" ? "Sign in to continue to Rostr." : "Sign up to start grading."}
          </p>

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
            className="flex flex-col gap-3"
          >
            <input
              className="w-full rounded-2xl px-4 py-3 bg-slate-50 border border-slate-200 text-slate-700 placeholder-slate-400 outline-none focus:ring-2 focus:ring-[#0b73d1]/30 transition-shadow"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              className="w-full rounded-2xl px-4 py-3 bg-slate-50 border border-slate-200 text-slate-700 placeholder-slate-400 outline-none focus:ring-2 focus:ring-[#0b73d1]/30 transition-shadow"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              className="w-full py-3 rounded-2xl font-semibold bg-[#070738] text-white hover:opacity-95 transition disabled:opacity-60 cursor-pointer"
              type="submit"
              disabled={loading}
            >
              {loading ? (mode === "signin" ? "Signing In..." : "Creating...") : mode === "signin" ? "Sign In" : "Sign Up"}
            </button>

            {message && (
              <p className="text-center text-sm text-slate-600 mt-1">{message}</p>
            )}
          </form>
        </div>
       </div>
     </div>
   );
 }
