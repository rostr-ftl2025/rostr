import SignInPage from "~/sign-in-page/SignInPage";
import type { Route } from "./+types/home";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "Rostr." },
    { name: "description", content: "Welcome to Rostr!" },
  ];
}

export default function Home() {
  return <SignInPage />;
}
