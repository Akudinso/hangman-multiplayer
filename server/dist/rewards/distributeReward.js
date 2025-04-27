"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.distributeReward = distributeReward;
const thirdweb_1 = require("../config/thirdweb"); // 👈 use the existing ones!
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function distributeReward(winnerWallet) {
    try {
        if (!thirdweb_1.tokenContract || !thirdweb_1.nftDrop) {
            throw new Error("Contracts not initialized");
        }
        await thirdweb_1.tokenContract.erc20.transfer(winnerWallet, "10");
        console.log(`💸 Sent 10 tokens to ${winnerWallet}`);
        const unclaimed = await thirdweb_1.nftDrop.erc721.totalUnclaimedSupply();
        if (unclaimed.gt(0)) {
            await thirdweb_1.nftDrop.erc721.claimTo(winnerWallet, 1);
            console.log(`🏅 Minted NFT badge to ${winnerWallet}`);
        }
        else {
            console.warn("⚠️ No NFTs left to claim.");
        }
    }
    catch (error) {
        console.error("❌ Reward failed:", error);
    }
}
