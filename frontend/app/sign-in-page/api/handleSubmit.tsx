import type { FormEvent } from "react";
import { API_URL } from "~/config";
import { getUserFromJWT } from "~/utils/getToken";

export async function handleSubmit(
  e: FormEvent<HTMLFormElement>,
  {
    mode,
    username,
    password,
    setMessage,
    setLoading,
    setUsername,
    setPassword,
    setUserInfo,
  }: {
    mode: "signin" | "signup";
    username: string;
    password: string;
    setMessage: (m: string) => void;
    setLoading: (b: boolean) => void;
    setUsername?: (s: string) => void;
    setPassword?: (s: string) => void;
    setUserInfo: (u: { username?: string; userID?: string } | null) => void;
  }
): Promise<void> {
  e.preventDefault();
  setMessage("Loading...");
  setLoading(true);

  console.log('API_URL:', API_URL);
  console.log('Attempting request to:', `${API_URL}/api/users/${mode}`);

  try {
    const res = await fetch(`${API_URL}/api/users/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username.trim(),
        password: password.trim(),
      }),
    });

    console.log('Response status:', res.status);
    const data = await res.json();
    console.log('Response data:', data);

    if (res.ok) {
      setMessage(
        mode === "signin" ? "Signed in successfully!" : "Account created successfully!"
      );

      if (mode === "signup") {
        setUsername?.("");
        setPassword?.("");
      }

      if (mode === "signin" && data.token) {
        localStorage.setItem("jwtToken", data.token);
        const info = getUserFromJWT(data.token);
        setUserInfo(info);
        if (info?.userID) {
          window.location.assign("/team-maker");
        }
      }
    } else {
      setMessage(data.error || "Something went wrong");
    }
  } catch (err: unknown) {
    console.error('Fetch error:', err);
    const messageText =
      err instanceof Error ? err.message : typeof err === "string" ? err : String(err);
    setMessage(messageText || "Network error");
    console.log('Error details:', messageText);
  } finally {
    setLoading(false);
  }
}