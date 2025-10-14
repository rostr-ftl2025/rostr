import TeamMakerPitchers from "~/team-maker-page/TeamMaker";
import type { Route } from "./+types/home";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "Rostr." },
    { name: "description", content: "Rostr - Team Maker" },
  ];
}

export default function TeamMaker() {
  return <TeamMakerPitchers />;
}
