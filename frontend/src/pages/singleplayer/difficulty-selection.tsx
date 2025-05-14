// pages/singleplayer/difficulty-selection.tsx
import React, { useState } from "react";
import Image from "next/image";
import Sidebar from "@/components/Sidebar";
import HeaderBar from "@/components/HeaderBar";
import HelpIcon from "@/components/HelpIcon";
import { useRouter } from 'next/router';


const DifficultySelection = () => {
    const router = useRouter();
    const [selectedDifficulty, setSelectedDifficulty] = useState("easy");

    const handleSelect = () => {
        router.push(`/singleplayer/level-selection?difficulty=${selectedDifficulty}`);
      };
      

    return (
        <div style={{ display: "flex", backgroundColor: "#0F0F0F", width: "100vw", height: "100vh", overflow: "hidden", position: "relative" }}>
            {/* Sidebar */}
            <Sidebar />

            {/* Main layout */}
            <div style={{ width: "1090px", height: "1024px", position: "relative" }}>
                {/* Background image */}
                <Image
                    src="/bg13-3.png"
                    alt="Background"
                    layout="fill"
                    objectFit="cover"
                    style={{ opacity: 0.15, zIndex: 0 }}
                />

                {/* Header */}
                <div style={{ position: "relative", zIndex: 1 }}>
                    <HeaderBar />
                </div>

                {/* Title & Subtitle */}
                <div style={{ position: "absolute", top: 200, left: 373, zIndex: 2 }}>
                    <h2 style={{ color: "#fff", fontSize: "32px", fontWeight: 700, textAlign: "center" }}>Select Difficulty Level</h2>
                    <p style={{ color: "#fff", fontSize: "16px", textAlign: "center", marginTop: "8px", maxWidth: "500px" }}>
                        Play against time to earn WordBit tokens. Mint an NFT every 10 levels.
                    </p>
                </div>

                {/* Difficulty Buttons */}
                <div
                    style={{
                        position: "absolute",
                        top: 350,
                        left: 59,
                        width: "1035px",
                        height: "180px",
                        display: "flex",
                        justifyContent: "space-between",
                        zIndex: 2,
                    }}
                >
                    {/* Easy */}
                    <div
                        onClick={() => setSelectedDifficulty("easy")}
                        style={{
                            width: 290,
                            height: 180,
                            padding: 10,
                            border: "2px solid #4D6947",
                            borderRadius: 12,
                            backgroundColor: selectedDifficulty === "easy" ? "#4D6947" : "transparent",
                            color: "#fff",
                            cursor: "pointer",
                        }}
                    >
                        <h3 style={{ fontSize: "24px", marginBottom: "12px" }}>Easy</h3>
                        <p style={{ fontSize: "14px" }}>+3 WordBits per win</p>
                    </div>

                    {/* Medium */}
                    <div
                        onClick={() => setSelectedDifficulty("medium")}
                        style={{
                            width: 300,
                            height: 180,
                            padding: 10,
                            borderRadius: 12,
                            backgroundColor: selectedDifficulty === "medium" ? "#C07728" : "#C07728",
                            color: "#fff",
                            cursor: "pointer",
                        }}
                    >
                        <h3 style={{ fontSize: "24px", marginBottom: "12px" }}>Medium</h3>
                        <p style={{ fontSize: "14px" }}>+6 WordBits per win</p>
                    </div>

                    {/* Hard */}
                    <div
                        onClick={() => setSelectedDifficulty("hard")}
                        style={{
                            width: 300,
                            height: 180,
                            padding: 10,
                            borderRadius: 12,
                            backgroundColor: selectedDifficulty === "hard" ? "#AD2E1E" : "#AD2E1E",
                            color: "#fff",
                            cursor: "pointer",
                        }}
                    >
                        <h3 style={{ fontSize: "24px", marginBottom: "12px" }}>Hard</h3>
                        <p style={{ fontSize: "14px" }}>+9 WordBits per win</p>
                    </div>
                </div>

                {/* Select Button */}
                <div style={{ position: "absolute", top: 570, left: 490, zIndex: 2 }}>
                    <button
                        onClick={handleSelect}
                        style={{
                            width: "220px",
                            height: "56px",
                            borderRadius: "12px",
                            backgroundColor: "#A259FF",
                            color: "white",
                            fontSize: "18px",
                            fontWeight: "bold",
                            marginTop: "2rem",
                        }}
                    >
                        Select
                    </button>

                </div>

                {/* Help Icon */}
                <div style={{ position: "absolute", bottom: 60, right: 60, zIndex: 2 }}>
                    <HelpIcon />
                </div>
            </div>
        </div>
    );
};

export default DifficultySelection;
