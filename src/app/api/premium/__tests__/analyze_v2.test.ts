/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from "vitest";
import { POST } from "../analyze/route";
import { NextRequest } from "next/server";

// Mock Supabase
vi.mock("@/lib/supabase/server", () => ({
  createServerSupabaseClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn(() => Promise.resolve({ data: { user: { id: "test-user-id" } } })),
    },
    from: vi.fn((table) => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      single: vi.fn(() => {
        if (table === "analysis_history") {
          return Promise.resolve({
            data: {
              id: "550e8400-e29b-41d4-a716-446655440000",
              summary: { title: "Test Persona", keywords: ["test"] },
              analysis: { colorSeason: "Spring", bodyType: "Hourglass", faceShape: "Oval" },
              fashion: { overview: "Test fashion" },
              beauty: { overview: "Test beauty" },
              language: "ko",
              visual_profile: {}
            }
          });
        }
        if (table === "payment_transactions") {
          return Promise.resolve({ data: { id: "test-tx-id", status: "paid" } });
        }
        // Case for return from insert
        if (table === "premium_reports") {
          return Promise.resolve({ 
            data: { 
              id: "test-report-id", 
              deep_analysis_json: { summary: { title: "Premium Brand" } } 
            } 
          });
        }
        return Promise.resolve({ data: null });
      }),
      insert: vi.fn().mockReturnThis(),
    })),
  })),
}));

// Mock Gemini
vi.mock("@/lib/gemini", async (importOriginal) => {
  const actual = await importOriginal() as any;
  return {
    ...actual,
    getGeminiModelJson: vi.fn(() => ({
      generateContent: vi.fn(() => Promise.resolve({
        response: {
          text: () => JSON.stringify({
            summary: { title: "Premium Brand", keywords: ["luxury"], brandAura: "Powerful" },
            deepAnalysis: { colorPsychology: "Trust", structuralHarmony: "Balanced", vibeArchetype: "Leader" },
            strategicStyling: { businessExecutive: "Suit", socialInfluence: "Chic", offDutyLuxury: "Silk" },
            expertRecommendations: { careerAdvice: "Lead", relationshipTips: "Connect", lifestyleUpgrade: "Groom" },
            detailedCapsuleWardrobe: [{ category: "Essentials", items: ["Item 1"], reasoning: "Good" }],
            actionPlan: { immediate: "Now", shortTerm: "Soon", longTerm: "Future" }
          })
        }
      })),
    })),
  };
});

describe("Premium Analyze API", () => {
  it("should generate a premium report successfully", async () => {
    const req = new NextRequest("http://localhost:3000/api/premium/analyze", {
      method: "POST",
      body: JSON.stringify({ analysis_id: "550e8400-e29b-41d4-a716-446655440000" }),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.result).toBeDefined();
    expect(data.result.deep_analysis_json.summary.title).toBe("Premium Brand");
  });

  it("should return 401 if unauthorized", async () => {
    // Override mock for this test
    const { createServerSupabaseClient } = await import("@/lib/supabase/server");
    vi.mocked(createServerSupabaseClient).mockReturnValueOnce({
      auth: { getUser: vi.fn(() => Promise.resolve({ data: { user: null } })) }
    } as any);

    const req = new NextRequest("http://localhost:3000/api/premium/analyze", {
      method: "POST",
      body: JSON.stringify({ analysis_id: "550e8400-e29b-41d4-a716-446655440000" }),
    });

    const response = await POST(req);
    expect(response.status).toBe(401);
  });
});
