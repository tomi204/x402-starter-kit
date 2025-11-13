import OpenAI from "openai";

interface AIServiceOptions {
  apiKey?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

interface MarketAnalysisResponse {
  message: string;
  analysis: {
    marketSentiment: {
      score: number;
      trend: "bullish" | "bearish" | "neutral";
      confidence: string;
      summary: string;
    };
    recommendations: Array<{
      action: "BUY" | "SELL" | "HOLD";
      asset: string;
      confidence: "HIGH" | "MEDIUM" | "LOW";
      reasoning: string;
    }>;
    riskFactors: string[];
    opportunities: string[];
  };
  generatedAt: string;
  model: string;
  tokens: number;
}

/**
 * AI Service - Generates market analysis using OpenRouter
 * Payment validation is handled by x402 middleware before this service is invoked
 */
export class AIService {
  private openai: OpenAI | null = null;
  private readonly model: string;
  private readonly temperature: number;
  private readonly maxTokens: number;
  private readonly useRealAPI: boolean;

  constructor({
    apiKey,
    model = "anthropic/claude-3.5-sonnet",
    temperature = 0.7,
    maxTokens = 800,
  }: AIServiceOptions = {}) {
    // Only initialize OpenRouter if API key is provided
    if (apiKey) {
      this.openai = new OpenAI({
        apiKey,
        baseURL: "https://openrouter.ai/api/v1",
      });
      this.useRealAPI = true;
    } else {
      this.useRealAPI = false;
      console.warn("⚠️ OpenRouter API key not provided. Using mock responses.");
    }

    this.model = model;
    this.temperature = temperature;
    this.maxTokens = maxTokens;
  }

  /**
   * Generate market analysis for Avalanche ecosystem
   */
  async generateMarketAnalysis(): Promise<MarketAnalysisResponse> {
    if (!this.useRealAPI || !this.openai) {
      // Return mock data if no API key
      return this.getMockAnalysis();
    }

    try {
      console.log("🤖 Calling OpenRouter API for market analysis...");

      const completion = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: "system",
            content: `You are a cryptocurrency market analyst specializing in the Avalanche blockchain ecosystem.
            Provide concise, data-driven analysis in JSON format with the following structure:
            {
              "marketSentiment": {
                "score": number (1-10),
                "trend": "bullish" | "bearish" | "neutral",
                "confidence": string (percentage),
                "summary": string (1-2 sentences)
              },
              "recommendations": [
                {
                  "action": "BUY" | "SELL" | "HOLD",
                  "asset": string,
                  "confidence": "HIGH" | "MEDIUM" | "LOW",
                  "reasoning": string (1 sentence)
                }
              ],
              "riskFactors": string[] (3-5 items),
              "opportunities": string[] (3-5 items)
            }`,
          },
          {
            role: "user",
            content:
              "Provide a current market analysis for the Avalanche (AVAX) ecosystem, including sentiment, trading recommendations, risk factors, and opportunities. Return only valid JSON.",
          },
        ],
        temperature: this.temperature,
        max_tokens: this.maxTokens,
      });

      const response = completion.choices[0]?.message?.content;

      if (!response) {
        throw new Error("No response from OpenRouter");
      }

      const analysis = JSON.parse(response);

      console.log("✅ OpenRouter analysis generated successfully");

      return {
        message: "AI Analysis Complete",
        analysis,
        generatedAt: new Date().toISOString(),
        model: this.model,
        tokens: completion.usage?.total_tokens || 0,
      };
    } catch (error) {
      console.error("❌ Error calling OpenRouter API:", error);

      // Fallback to mock data on error
      console.warn("⚠️ Falling back to mock analysis");
      return this.getMockAnalysis();
    }
  }

  /**
   * Mock analysis data for when OpenAI is not available
   */
  private getMockAnalysis(): MarketAnalysisResponse {
    return {
      message: "AI Analysis Complete (Mock Data)",
      analysis: {
        marketSentiment: {
          score: 7.8,
          trend: "bullish" as const,
          confidence: "85%",
          summary:
            "Strong positive sentiment across Avalanche ecosystem. Increased developer activity and institutional interest.",
        },
        recommendations: [
          {
            action: "BUY" as const,
            asset: "AVAX",
            confidence: "HIGH" as const,
            reasoning:
              "Technical indicators show strong support at current levels. Network activity increasing.",
          },
          {
            action: "HOLD" as const,
            asset: "JOE",
            confidence: "MEDIUM" as const,
            reasoning:
              "Wait for next major protocol upgrade before increasing position.",
          },
          {
            action: "BUY" as const,
            asset: "GMX",
            confidence: "MEDIUM" as const,
            reasoning:
              "Growing trading volume and improved liquidity on Avalanche deployment.",
          },
        ],
        riskFactors: [
          "Market volatility in macro environment",
          "Regulatory uncertainty in crypto space",
          "Competition from other L1 chains",
          "Potential network congestion during high activity",
        ],
        opportunities: [
          "Growing DeFi ecosystem on Avalanche",
          "Subnet deployments increasing",
          "Institutional adoption trending up",
          "GameFi and NFT projects launching on platform",
        ],
      },
      generatedAt: new Date().toISOString(),
      model: this.useRealAPI ? this.model : "Mock",
      tokens: this.useRealAPI ? 0 : 500,
    };
  }
}
