// src/config/thirdweb-server.ts
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import dotenv from "dotenv";
dotenv.config();

export const sdk = ThirdwebSDK.fromPrivateKey(
  process.env.PRIVATE_KEY!,
  "sepolia",
  { secretKey: process.env.THIRDWEB_SECRET_KEY }
);
