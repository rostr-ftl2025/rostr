import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("team-maker", "routes/team-maker.tsx"),
    route("grading-display", "routes/grading-display.tsx"),
    route("lineup-recommendation", "routes/lineup-recommendation.tsx"),
    route("opponent-weaknesses", "routes/opponent-weaknesses.tsx"),
    route("counter-lineup", "routes/counter-lineup.tsx")
] satisfies RouteConfig;
