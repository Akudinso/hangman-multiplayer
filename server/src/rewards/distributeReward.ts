import { tokenContract, nftDrop } from "../config/thirdweb"; // 👈 use the existing ones!
import dotenv from "dotenv";

dotenv.config();

export async function distributeReward(winnerWallet: string) {
  try {
    if (!tokenContract || !nftDrop) {
      throw new Error("Contracts not initialized");
    }

    await tokenContract.erc20.transfer(winnerWallet, "10");
    console.log(`💸 Sent 10 tokens to ${winnerWallet}`);

    const unclaimed = await nftDrop.erc721.totalUnclaimedSupply();
    if (unclaimed.gt(0)) {
      await nftDrop.erc721.claimTo(winnerWallet, 1);
      console.log(`🏅 Minted NFT badge to ${winnerWallet}`);
    } else {
      console.warn("⚠️ No NFTs left to claim.");
    }
  } catch (error) {
    console.error("❌ Reward failed:", error);
  }
}
