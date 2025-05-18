// pages/singleplayer/source-nfts.tsx
import { useEffect, useState } from "react";
import Image from "next/image";
import Sidebar from "@/components/Sidebar";
import HeaderBar from "@/components/HeaderBar";
import HelpIcon from "@/components/HelpIcon";
import { useAddress } from "@thirdweb-dev/react";
import { sdk } from "@/config/thirdweb";
import { useRouter } from "next/router";
import MintSuccessModal from "@/components/MintSuccessModal";


const nftList = [
  {
    id: "nft-1",
    name: "Word Dragon",
    difficulty: "easy",
    cost: 15,
    image: "/nfts/African-salad.png",
  },
  {
    id: "nft-2",
    name: "Bit Wizard",
    difficulty: "medium",
    cost: 30,
    image: "/nfts/Ankara-prints.png",
  },
  {
    id: "nft-3",
    name: "Alpha Knight",
    difficulty: "hard",
    cost: 60,
    image: "/nfts/Artifacts.png",
  },
  {
    id: "nft-4",
    name: "Birthday-cake",
    difficulty: "easy",
    cost: 60,
    image: "/nfts/Birthday-cake.png",
  },
  {
    id: "nft-5",
    name: "Boots",
    difficulty: "medium",
    cost: 60,
    image: "/nfts/Boots.jpg",
  },
  {
    id: "nft-6",
    name: "Corporate-shirt",
    difficulty: "hard",
    cost: 60,
    image: "/nfts/Coporate-shirt.png",
  },
];

export default function SourceNFTsPage() {
  const address = useAddress();
  const router = useRouter();
  const [balance, setBalance] = useState(0);
  const [minting, setMinting] = useState(false);
  const [showModal, setShowModal] = useState(false);
const [txHash, setTxHash] = useState("");


  useEffect(() => {
    const fetchBalance = async () => {
      if (!address || !sdk) return;
      try {
        const token = await sdk.getContract(process.env.NEXT_PUBLIC_TOKEN_CONTRACT!, "token");
        const result = await token.erc20.balanceOf(address);
        setBalance(parseInt(result.displayValue));
      } catch (err) {
        console.error("Balance fetch failed", err);
      }
    };
    fetchBalance();
  }, [address]);

  const handleMintOrPlay = (nft: typeof nftList[number]) => {
    if (balance >= nft.cost) {
      // mint logic
      setMinting(true);
      fetch("/api/mint-nft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, nftId: nft.id }),
      })
        .then((res) => res.json())
        .then((data) => {
          setMinting(false);
          if (data.success) {
            setTxHash(data.txHash); // make sure the API returns txHash
            setShowModal(true);
          } else {
            alert("Mint failed: " + data.error);
          }
          
        });
    } else {
      router.push(`/singleplayer/level-selection?difficulty=${nft.difficulty}`);
    }
  };

  return (
    <div style={{ display: "flex", backgroundColor: "#0F0F0F", width: "100vw", minHeight: "100vh", overflowX: "hidden" }}>
      <Sidebar />

      <div style={{ flex: 1, padding: "2rem", position: "relative", overflowY: "auto" }}>
        <HeaderBar />

        <h2 style={{ color: "#fff", fontSize: "28px", marginBottom: "20px", textAlign: "center" }}>
          Source Your WordBit NFT
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "24px",
            justifyContent: "center",
            alignItems: "center",
            padding: "2rem",
          }}
        >
          {nftList.map((nft) => (
            <div
              key={nft.id}
              style={{
                background: "#1F1F1F",
                borderRadius: "16px",
                padding: "16px",
                color: "#fff",
                textAlign: "center",
                border: "1px solid #333",
              }}
            >
              <Image src={nft.image} alt={nft.name} width={160} height={160} />
              <h3 style={{ marginTop: "12px", fontSize: "20px" }}>{nft.name}</h3>
              <p style={{ fontSize: "14px", color: "#aaa" }}>Difficulty: {nft.difficulty}</p>
              <p style={{ fontSize: "14px", marginBottom: "12px" }}>Cost: {nft.cost} WB</p>

              <button
                disabled={minting}
                onClick={() => handleMintOrPlay(nft)}
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: "#A259FF",
                  color: "#fff",
                  borderRadius: "12px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {balance >= nft.cost ? "Mint NFT" : "Play to Earn"}
              </button>
            </div>
          ))}
        </div>

        <MintSuccessModal isOpen={showModal} onClose={() => setShowModal(false)} txHash={txHash} />


        <HelpIcon />
      </div>
    </div>
  );
}
