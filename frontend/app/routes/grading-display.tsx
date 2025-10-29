import GradingDisplayPage from "~/grading-display-page/GradingDisplayPage";
import type { Route } from "./+types/home";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "Team Grade" },
    { name: "description", content: "Displays the calculated grade." },
  ];
}

export default function GradingDisplayRoute() {
  return <GradingDisplayPage />;
}
