import { AgentFn } from "./base.agent";

interface DomainSignature {
  domain: string;
  keywords: string[];
  confidence: number;
}

const DOMAIN_SIGNATURES: DomainSignature[] = [
  {
    domain: "finance",
    keywords: [
      "revenue",
      "profit",
      "ebitda",
      "gross margin",
      "cash flow",
      "earnings",
      "financial",
      "debt",
      "equity"
    ],
    confidence: 0
  },
  {
    domain: "esg",
    keywords: [
      "carbon",
      "emissions",
      "sustainability",
      "environmental",
      "social",
      "governance",
      "diversity",
      "renewable",
      "esg",
      "sdg"
    ],
    confidence: 0
  },
  {
    domain: "operations",
    keywords: [
      "operational",
      "efficiency",
      "capacity",
      "production",
      "supply chain",
      "logistics",
      "quality",
      "process",
      "manufacturing"
    ],
    confidence: 0
  },
  {
    domain: "risk",
    keywords: [
      "risk",
      "compliance",
      "regulatory",
      "audit",
      "internal control",
      "exposure",
      "mitigation",
      "threat"
    ],
    confidence: 0
  },
  {
    domain: "market",
    keywords: [
      "market share",
      "customer",
      "market",
      "competitive",
      "industry",
      "segment",
      "product",
      "sales"
    ],
    confidence: 0
  }
];

export const DomainInferenceAgent: AgentFn = async (state) => {
  console.log("🔍 DomainInferenceAgent inferring document domains...");

  const detectedDomains = new Map<string, number>();

  // Combine all text for analysis
  let fullText = "";
  if (state.pages) {
    fullText += state.pages.map((p: any) => p.text || "").join(" ");
  }
  if (state.sections) {
    fullText += state.sections.map((s: any) => s.content || "").join(" ");
  }

  const textLower = fullText.toLowerCase();

  // Score each domain based on keyword presence
  for (const domainSig of DOMAIN_SIGNATURES) {
    let score = 0;
    for (const keyword of domainSig.keywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, "gi");
      const matches = textLower.match(regex);
      score += matches ? matches.length : 0;
    }
    if (score > 0) {
      detectedDomains.set(domainSig.domain, score);
    }
  }

  // Sort by score and select top domains
  const sortedDomains = Array.from(detectedDomains.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([domain]) => domain);

  state.domains = sortedDomains;

  console.log(`✅ Detected domains: ${sortedDomains.join(", ") || "unknown"}`);

  return state;
};
