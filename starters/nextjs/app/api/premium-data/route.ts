import { NextResponse } from "next/server";

// This is a mock API endpoint that returns premium data
// In a real application, this would fetch data from a database or external API
export async function GET() {
  const premiumData = {
    message: "Congratulations! You have access to premium data.",
    data: {
      insights: [
        {
          id: 1,
          title: "Avalanche C-Chain Analytics",
          description: "Real-time network statistics and transaction data",
          metrics: {
            tps: "4,500",
            blockTime: "0.8s",
            validators: "1,200+",
          },
        },
        {
          id: 2,
          title: "DeFi Opportunities",
          description: "Curated list of high-yield farming opportunities",
          protocols: ["Trader Joe", "Aave", "Benqi", "Platypus"],
        },
        {
          id: 3,
          title: "Market Intelligence",
          description: "Advanced trading signals and price predictions",
          accuracy: "87%",
        },
      ],
      exclusiveContent: {
        researchReports: 12,
        tradingSignals: 45,
        tutorialVideos: 23,
      },
    },
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(premiumData);
}
