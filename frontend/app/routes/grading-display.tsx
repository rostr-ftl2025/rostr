import GradingDisplayPage from "~/components/GradingDisplayPage";
import type { Route } from "./+types/grading-display";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Team Grade" },
    { name: "description", content: "Displays the calculated grade." },
  ];
}

export default function GradingDisplayRoute() {
  return <GradingDisplayPage />;
}
