import LineupRecommendationPage from "~/lineup-recommendation-page/LineupRecommendationPage";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Lineup Recommendation" },
    { name: "description", content: "Displays recommended starting pitchers for the team." },
  ];
}

export default function LineupRecommendationRoute() {
  return <LineupRecommendationPage />;
}