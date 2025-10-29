import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("team-maker", "routes/team-maker.tsx"),
    route("grading-display", "routes/grading-display.tsx")
] satisfies RouteConfig;
