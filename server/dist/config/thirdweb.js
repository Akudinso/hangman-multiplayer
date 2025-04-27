"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nftDrop = exports.tokenContract = exports.sdk = void 0;
exports.initThirdwebContracts = initThirdwebContracts;
const sdk_1 = require("@thirdweb-dev/sdk");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// 🔑 SDK instance using your wallet's private key
exports.sdk = sdk_1.ThirdwebSDK.fromPrivateKey(process.env.PRIVATE_KEY, "sepolia", // or your preferred chain
{ secretKey: process.env.THIRDWEB_SECRET_KEY });
// 🧱 Preload contracts (safely without top-level await)
let tokenContract;
let nftDrop;
async function initThirdwebContracts() {
    exports.tokenContract = tokenContract = await exports.sdk.getContract(process.env.TOKEN_CONTRACT, "token");
    exports.nftDrop = nftDrop = await exports.sdk.getContract(process.env.NFT_CONTRACT, "nft-drop");
}
