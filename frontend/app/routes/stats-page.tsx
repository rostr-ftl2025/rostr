import { Navbar } from "~/components/navbar";
import { StatsPage } from "~/stats-page/StatsPage";

export default function StatsRoute() {
  return (
    <>
      <Navbar />
      <StatsPage />
    </>
  );
}