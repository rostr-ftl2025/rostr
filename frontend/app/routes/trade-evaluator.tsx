import TradeEvaluator from "~/trade-evaluator-page/TradeEvaluator"
import type { Route } from "./+types/trade-evaluator"
import { Navbar } from "~/components/navbar";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Rostr. Trade Evaluator" },
    { name: "description", content: "Analyze trades between fantasy teams" },
  ]
}

export default function TradeEvaluatorRoute() {
    return (
  
  
      <>
        <Navbar />
        <TradeEvaluator />
      </>
  
    );
}
