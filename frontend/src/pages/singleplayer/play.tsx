// pages/singleplayer/play.tsx
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { wordBank } from "@/data/wordBank";
import confetti from "canvas-confetti";
import { useAddress } from "@thirdweb-dev/react";
import { ConnectWallet } from "@thirdweb-dev/react";
import { sdk } from "@/config/thirdweb";
import GameOverModal from "@/components/GameOverModal";

const PlayScreen = () => {
    const router = useRouter();
    const { difficulty = "easy", level = "1" } = router.query;
    const address = useAddress();

    const [targetWord, setTargetWord] = useState("");
    const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
    const [hint, setHint] = useState("");
    const [gameOver, setGameOver] = useState(false);
    const [status, setStatus] = useState<"win" | "lose" | null>(null);
    const [attempts, setAttempts] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [balance, setBalance] = useState("0");
    const [wordRevealed, setWordRevealed] = useState(false);


    const maxAttempts = 6;

    const getRandomWord = () => {
        const wordsForDifficulty = wordBank[difficulty as "easy" | "medium" | "hard"];
        const random = wordsForDifficulty[Math.floor(Math.random() * wordsForDifficulty.length)];
        setTargetWord(random.word.toLowerCase());
        setHint(random.hint);
        setGuessedLetters([]);
        setAttempts(0);
        setTimeLeft(60);
        setGameOver(false);
        setStatus(null);
    };


    const fetchBalance = useCallback(async () => {
        if (!address || !sdk) return;
        try {
            const tokenAddress = process.env.NEXT_PUBLIC_TOKEN_CONTRACT!;
            const token = await sdk.getContract(tokenAddress, "token");
            const result = await token.erc20.balanceOf(address);
            setBalance(result.displayValue);
        } catch (err) {
            console.error("Balance fetch failed", err);
        }
    }, [address]);


    const saveLevelProgress = useCallback(() => {
        const key = `completed_${difficulty}`;
        const existing = JSON.parse(localStorage.getItem(key) || "[]");
        if (!existing.includes(level)) {
            localStorage.setItem(key, JSON.stringify([...existing, level]));
        }
    }, [difficulty, level]);


    const rewardPlayer = useCallback(async () => {
        if (!address) return;

        try {
            console.log("🚀 Attempting reward for", address, "with difficulty", difficulty);
            const res = await fetch("/api/reward", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ address, difficulty }),
            });

            const data = await res.json();
            if (res.ok) {
                console.log(`✅ Rewarded ${data.amount} tokens`);
                await fetchBalance();
            } else {
                console.warn("Reward error", data.error);
            }
        } catch (err) {
            console.error("Reward failed", err);
        }
    }, [address, difficulty]);


    const mintNFTIfNeeded = useCallback(() => {
        const key = `completed_${difficulty}`;
        const completedLevels = JSON.parse(localStorage.getItem(key) || "[]");

        if (completedLevels.length % 10 === 0) {
            fetch("/api/mint-nft", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ address }),
            });
        }
    }, [difficulty, address]);


    useEffect(() => {
        getRandomWord();
    }, [difficulty, level]);

    useEffect(() => {
        fetchBalance();
    }, [address, fetchBalance]); // ✅ Include fetchBalance if it's defined with useCallback      

    useEffect(() => {
        const timer = setInterval(() => {
            if (!gameOver && timeLeft > 0) {
                setTimeLeft((prev) => prev - 1);
            } else if (timeLeft === 0 && !gameOver) {
                setGameOver(true);
                setStatus("lose");
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft, gameOver]);

    const handleGuess = (letter: string) => {
        if (gameOver || guessedLetters.includes(letter)) return;

        setGuessedLetters((prev) => [...prev, letter]);

        if (!targetWord.includes(letter)) {
            setAttempts((prev) => prev + 1);
        }
    };

    useEffect(() => {
        if (!targetWord || wordRevealed) return;
        const allGuessed = targetWord.split("").every((char) => guessedLetters.includes(char));

        if (attempts >= maxAttempts && !gameOver) {
            setStatus("lose");
            setGameOver(true);
        } else if (allGuessed && !gameOver) {
            setStatus("win");
            setGameOver(true);
            confetti();
            saveLevelProgress();
            rewardPlayer();
            mintNFTIfNeeded();

            setTimeout(() => {
                router.push(`/singleplayer/level-selection?difficulty=${difficulty}`);
            }, 2000);
        }
    }, [
        attempts,
        guessedLetters,
        gameOver,
        router,
        difficulty,
        targetWord,
        rewardPlayer,
        saveLevelProgress,
        mintNFTIfNeeded,
        wordRevealed,
    ]);



    const handleReveal = () => {
        if (!targetWord) return;

        setWordRevealed(true); // ✅ Set flag
        setGuessedLetters(targetWord.split(""));

        const key = `completed_${difficulty}`;
        const existing = JSON.parse(localStorage.getItem(key) || "[]");
        if (!existing.includes(level)) {
            localStorage.setItem(key, JSON.stringify([...existing, level]));
        }

        setTimeout(() => {
            router.push(`/singleplayer/level-selection?difficulty=${difficulty}`);
        }, 1500);
    };



    const handleSkip = () => getRandomWord();

    const keyboard = "abcdefghijklmnopqrstuvwxyz".split("");

    const renderWord = () =>
        targetWord.split("").map((char, idx) => (
            <span
                key={idx}
                style={{
                    width: "40px",
                    height: "60px",
                    borderBottom: "3px solid #A259FF",
                    margin: "0 8px",
                    fontSize: "32px",
                    textAlign: "center",
                    lineHeight: "60px",
                    display: "inline-block",
                    color: "#fff",
                    fontFamily: "Athletics",
                    letterSpacing: "2px",
                }}
            >
                {guessedLetters.includes(char) ? char.toUpperCase() : ""}
            </span>

        ));

    const handleNext = () => {
        router.push(`/singleplayer/level-selection?difficulty=${difficulty}`);
    };


    const handleHome = () => {
        router.push("/singleplayer/game-mode-selection");
    };

    return (
        <div style={{ background: "#0F0F0F", minHeight: "100vh", padding: "2rem", color: "#fff" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>🔊</div>
                <div style={{ textAlign: "center" }}>
                    <h2>{`${(difficulty as string).charAt(0).toUpperCase() + (difficulty as string).slice(1)} - Level ${level}`}</h2>
                    <p>⏱️ {timeLeft}s</p>
                </div>
                <div style={{ textAlign: "right" }}>
                    <ConnectWallet
                        theme="dark"
                        btnTitle="Connect Wallet"
                        modalTitle="Login to WordBit"
                        style={{
                            backgroundColor: "#1F1F1F",
                            color: "#fff",
                            borderRadius: "12px",
                            padding: "8px 16px",
                            fontWeight: "bold",
                            fontSize: "14px",
                            border: "1px solid #4D6947",
                        }}
                    />

                    <p>🪙 {balance || "0"} WB</p>
                </div>
            </div>

            {/* Word */}
            <div style={{ marginTop: "3rem", textAlign: "center" }}>{renderWord()}</div>

            {/* Controls */}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "0 4rem", marginTop: "2rem" }}>
                <button onClick={handleReveal} style={{ background: "#C07728", color: "#fff", padding: "12px 24px", borderRadius: "8px" }}>
                    🔍 Reveal
                </button>
                <button
                    onClick={handleSkip}
                    style={{ border: "1px solid #A259FF", background: "transparent", color: "#fff", padding: "12px 24px", borderRadius: "12px" }}
                >
                    ⏭️ Skip Word
                </button>
            </div>

            {/* Hint */}
            <div
                style={{
                    marginTop: "2rem",
                    border: "2px solid #A259FF",
                    padding: "12px",
                    borderRadius: "12px",
                    width: "fit-content",
                    marginLeft: "auto",
                    marginRight: "auto",
                }}
            >
                💡 Hint: {hint}
            </div>

            {/* Keyboard */}
            <div
                style={{
                    marginTop: "2rem",
                    width: "844px",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "12px",
                    justifyContent: "center",
                    marginLeft: "auto",
                    marginRight: "auto",
                }}
            >
                {keyboard.map((key) => (
                    <button
                        key={key}
                        onClick={() => handleGuess(key)}
                        disabled={guessedLetters.includes(key) || gameOver}
                        style={{
                            width: "70px",
                            height: "70px",
                            background: "#A259FF",
                            color: "#fff",
                            borderRadius: "8px",
                            fontSize: "20px",
                            cursor: "pointer",
                            opacity: guessedLetters.includes(key) ? 0.4 : 1,
                        }}
                    >
                        {key.toUpperCase()}
                    </button>
                ))}
            </div>

            {gameOver && status === "win" && (
                <p style={{ textAlign: "center", color: "#22c55e", fontSize: "24px", marginTop: "1rem" }}>
                    🎉 You won!
                </p>
            )}

            {gameOver && status === "lose" && (
                <p style={{ textAlign: "center", color: "#ef4444", fontSize: "24px", marginTop: "1rem" }}>
                    💀 Time&apos;s up! Try again.
                </p>
            )}


            {/* Game Over Modal */}
            {gameOver && !wordRevealed && (
                <GameOverModal
                    isOpen={gameOver}
                    correct={targetWord.split("").filter((char) => guessedLetters.includes(char)).length}
                    total={targetWord.length}
                    reward={difficulty === "easy" ? 3 : difficulty === "medium" ? 6 : 9}
                    gameStatus={status as "win" | "lose"}
                    onHome={handleHome}
                    onNext={handleNext}
                />
            )}
        </div>
    );
};

export default PlayScreen;
