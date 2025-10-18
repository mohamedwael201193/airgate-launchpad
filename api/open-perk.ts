// Generic API handler for perk endpoint
// Can be adapted for different runtime environments (Vercel, Express, etc.)

export default async function handler(req: any, res: any) {
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");
  const { proof } = req.body || {};
  if (!proof) return res.status(400).json({ error: "missing proof" });
  // TODO: Validate proof server-side using AIR Kit server helpers when available.
  // For demo, accept any non-empty proof and return a sample URL.
  return res.status(200).json({ url: "https://example.com/perk" });
}