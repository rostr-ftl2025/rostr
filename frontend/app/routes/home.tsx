import type { Route } from "./+types/home";
import SignInPage from "~/sign-in-page/SignInPage";
import TeamMaker from "~/team_maker_page/TeamMaker"; 


export function meta({}: Route.MetaArgs) {
  return [
    { title: "Rostr." },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return <SignInPage/>;
}
