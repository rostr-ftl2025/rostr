import React, { useEffect, useState } from "react";
import { getUserFromJWT } from "~/utils/getToken";

export default function SignInPage() {
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [userInfo, setUserInfo] = useState<{ username?: string; userID?: string } | null>(null);

  // Check JWT on page load
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      const info = getUserFromJWT(token);
      setUserInfo(info);
      if (info?.userID) {
        window.location.assign("/team-maker");
      }
    }
  }, []);

  // Local form state (UI only — wire up your auth calls where indicated)
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: replace with real auth call (fetch / axios to backend)
    console.log(mode === "signin" ? "Signing in" : "Signing up", form);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#070738]">
      <div className="w-full max-w-4xl mx-6 lg:mx-auto p-8">
        {!showAuthForm ? (
          <div className="flex justify-center">
            <div className="inline-flex rounded-xl bg-white/10 backdrop-blur-md px-6 py-5 shadow-lg border border-white/10">
              <button
                onClick={() => {
                  setMode("signin");
                  setShowAuthForm(true);
                }}
                className="px-6 py-2 rounded-md bg-white/10 hover:bg-white/20 text-white font-medium transition"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setMode("signup");
                  setShowAuthForm(true);
                }}
                className="ml-4 px-6 py-2 rounded-md bg-white text-[#0b73d1] font-semibold shadow-sm hover:opacity-95 transition"
              >
                Sign Up
              </button>
            </div>
          </div>
        ) : (
          <div className="mx-auto bg-white/6 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl p-8 lg:p-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-white">
                  {mode === "signin" ? "Welcome back" : "Create your account"}
                </h2>
                <p className="mt-1 text-sm text-white/80">
                  {mode === "signin"
                    ? "Sign in to continue to Rostr."
                    : "Sign up to start making teams."}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMode("signin")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                    mode === "signin"
                      ? "bg-white text-[#0b73d1]"
                      : "bg-white/10 text-white/90 hover:bg-white/20"
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setMode("signup")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                    mode === "signup"
                      ? "bg-white text-[#0b73d1]"
                      : "bg-white/10 text-white/90 hover:bg-white/20"
                  }`}
                >
                  Sign Up
                </button>
                <button
                  onClick={() => setShowAuthForm(false)}
                  className="ml-4 text-sm text-white/70 hover:text-white transition"
                >
                  Close
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-4">
              {mode === "signup" && (
                <input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Username"
                  className="w-full px-4 py-3 rounded-lg bg-white/90 text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-white/30"
                  required
                />
              )}

              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                type="email"
                className="w-full px-4 py-3 rounded-lg bg-white/90 text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-white/30"
                required
              />

              <input
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                type="password"
                className="w-full px-4 py-3 rounded-lg bg-white/90 text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-white/30"
                required
              />

              {mode === "signup" && (
                <input
                  name="confirm"
                  value={form.confirm}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  type="password"
                  className="w-full px-4 py-3 rounded-lg bg-white/90 text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-white/30"
                  required
                />
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full px-4 py-3 rounded-lg bg-white text-[#0b73d1] font-semibold shadow-md hover:opacity-95 transition"
                >
                  {mode === "signin" ? "Sign In" : "Create Account"}
                </button>
              </div>

              <p className="text-xs text-white/70 mt-2">
                By continuing you agree to our <span className="underline">Terms</span> and <span className="underline">Privacy</span>.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}