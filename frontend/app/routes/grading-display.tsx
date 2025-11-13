// src/routes/grading-display/+page.tsx (or +route.tsx depending on your setup)

import GradingDisplayPage from "~/grading-display-page/GradingDisplayPage";


export function meta() {
  return [
    { title: "Team Grade" },
    { name: "description", content: "Displays the calculated grade for your roster." },
  ];
}

export default function GradingDisplayRoute() {
  return <GradingDisplayPage />;
}
