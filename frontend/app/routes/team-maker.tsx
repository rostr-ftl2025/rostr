import TeamMaker from "~/team-maker-page/TeamMaker";
import type { Route } from "./+types/home";
import { Navbar } from "~/components/navbar";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "Rostr." },
    { name: "description", content: "Rostr - Team Maker" },
  ];
}

export default function TeamMakerRoute() {
  return (


    <>
      <Navbar />
      <TeamMaker />
    </>

  );
}
