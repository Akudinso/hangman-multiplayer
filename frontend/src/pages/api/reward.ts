// pages/api/reward.ts
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { NextApiRequest, NextApiResponse } from "next";
import dotenv from "dotenv";

dotenv.config();

const sdk = ThirdwebSDK.fromPrivateKey(
  process.env.PRIVATE_KEY!,
  "sepolia",
  { secretKey: process.env.THIRDWEB_SECRET_KEY }
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { address, difficulty } = req.body;
  console.log("📩 Reward API hit for:", address, "Difficulty:", difficulty);


  if (!address || !difficulty) return res.status(400).json({ error: "Missing data" });

  try {
    const token = await sdk.getContract(process.env.TOKEN_CONTRACT!, "token");

    const amount =
      difficulty === "easy" ? "3" :
      difficulty === "medium" ? "6" :
      "9";

    await token.erc20.transfer(address, amount);
    res.status(200).json({ success: true, amount });
  } catch (err) {
    console.error("Reward error:", err);
    res.status(500).json({ error: "Reward failed" });
  }
}
