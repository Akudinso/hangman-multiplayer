// pages/singleplayer/level-selection.tsx

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import Sidebar from "@/components/Sidebar";
import HeaderBar from "@/components/HeaderBar";
import HelpIcon from "@/components/HelpIcon";

const LevelSelection = () => {
    const router = useRouter();
    const { difficulty } = router.query as { difficulty?: string };
    const [selectedLevel, setSelectedLevel] = useState<number>(1);
    const [completedLevels, setCompletedLevels] = useState<string[]>([]);

    const handlePlay = () => {
        if (!difficulty || !selectedLevel) return;
        router.push(`/singleplayer/play?difficulty=${difficulty}&level=${selectedLevel}`);
    };

    useEffect(() => {
        if (difficulty) {
            const key = `completed_${difficulty}`;
            const completed = JSON.parse(localStorage.getItem(key) || "[]");
            setCompletedLevels(completed);
        }
    }, [difficulty]);

    const levels = Array.from({ length: 10 }, (_, i) => i + 1);

    return (
        <div style={{ display: "flex", backgroundColor: "#0F0F0F", width: "100%", height: "100vh", overflow: "hidden" }}>
            <Sidebar />

            <div style={{ width: "1090px", height: "1024px", position: "relative" }}>
                {/* Background */}
                <Image
                    src="/bg13-3.png"
                    alt="Background"
                    layout="fill"
                    objectFit="cover"
                    style={{ opacity: 0.15, zIndex: 0 }}
                />

                <div style={{ position: "relative", zIndex: 1 }}>
                    <HeaderBar />
                </div>

                {/* Title */}
                <div style={{ position: "absolute", top: 200, left: 373, zIndex: 2 }}>
                    <h2 style={{ color: "#fff", fontSize: "32px", fontWeight: 700, textAlign: "center" }}>
                        {(difficulty || "Easy").charAt(0).toUpperCase() + (difficulty || "Easy").slice(1)} Levels
                    </h2>
                    <p style={{ color: "#fff", fontSize: "16px", textAlign: "center", marginTop: "8px", maxWidth: "500px" }}>
                        Play to earn WordBit tokens. NFT every 10 wins!
                    </p>
                </div>


                {/* Levels Grid */}
                <div
                    style={{
                        position: "absolute",
                        top: 350,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "568px",
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "14px",
                        zIndex: 2,
                        justifyContent: "center",
                    }}
                >
                    {levels.map((level) => {
                        const isSelected = selectedLevel === level;
                        const isCompleted = completedLevels.includes(level.toString());

                        return (
                            <div
                                key={level}
                                onClick={() => setSelectedLevel(level)}
                                style={{
                                    width: "81.5px",
                                    height: "84.6px",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    position: "relative",
                                    transition: "all 0.3s ease",
                                    boxShadow: isSelected
                                        ? "2px 2px 15px #FFFFFF4D, 2px 2px 10px #FFFFFF1A"
                                        : "none",
                                }}
                            >
                                <Image
                                    src="/padlock.png"
                                    alt={`Level ${level}`}
                                    width={81}
                                    height={84}
                                    style={{
                                        opacity: isCompleted ? 0.4 : 1,
                                        filter: isCompleted ? "blur(1px)" : "none",
                                        transition: "opacity 0.3s, filter 0.3s",
                                    }}
                                />
                            </div>
                        );
                    })}

                </div>

                {/* Play Button */}
                <div style={{ position: "absolute", top: 570, left: 490, zIndex: 2 }}>
                    <button
                        onClick={handlePlay}
                        style={{
                            width: "220px",
                            height: "56px",
                            borderRadius: "12px",
                            backgroundColor: "#A259FF",
                            color: "white",
                            fontSize: "18px",
                            fontWeight: "bold",
                            marginTop: "2rem",
                            cursor: "pointer",
                        }}
                    >
                        Play
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

export default LevelSelection;
