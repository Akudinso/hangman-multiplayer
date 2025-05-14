// pages/singleplayer/play.tsx
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { wordBank } from "@/data/wordBank";
import confetti from "canvas-confetti";
import { useAddress } from "@thirdweb-dev/react";
import { sdk } from "@/config/thirdweb";
import GameOverModal from "@/components/GameOverModal";

const PlayScreen = () => {
    const router = useRouter();
    const { difficulty = "easy", level = "1" } = router.query;
    const currentLevel = parseInt(level as string);
    const address = useAddress();

    const [targetWord, setTargetWord] = useState("");
    const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
    const [hint, setHint] = useState("");
    const [gameOver, setGameOver] = useState(false);
    const [status, setStatus] = useState<"win" | "lose" | null>(null);
    const [attempts, setAttempts] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [balance, setBalance] = useState("0");

    const maxAttempts = 6;

    const getRandomWord = () => {
        const random = wordBank[Math.floor(Math.random() * wordBank.length)];
        setTargetWord(random.word.toLowerCase());
        setHint(random.hint);
        setGuessedLetters([]);
        setAttempts(0);
        setTimeLeft(60);
        setGameOver(false);
        setStatus(null);
    };

    const fetchBalance = async () => {
        if (!address || !sdk) return;
        try {
            const tokenAddress = process.env.NEXT_PUBLIC_TOKEN_CONTRACT!;
            const token = await sdk.getContract(tokenAddress, "token");
            const result = await token.erc20.balanceOf(address);
            setBalance(result.displayValue);
        } catch (err) {
            console.error("Balance fetch failed", err);
        }
    };

    const saveLevelProgress = () => {
        const key = `completed_${difficulty}`;
        const existing = JSON.parse(localStorage.getItem(key) || "[]");
        if (!existing.includes(level)) {
            localStorage.setItem(key, JSON.stringify([...existing, level]));
        }
    };

    const rewardPlayer = async () => {
        if (!address) return;
        try {
            const res = await fetch("/api/reward", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ address, difficulty }),
            });

            const data = await res.json();
            if (res.ok) {
                console.log(`✅ Rewarded ${data.amount} tokens`);
                fetchBalance();
            } else {
                console.warn("Reward error", data.error);
            }
        } catch (err) {
            console.error("Reward failed", err);
        }
    };

    const mintNFTIfNeeded = () => {
        const key = `completed_${difficulty}`;
        const completedLevels = JSON.parse(localStorage.getItem(key) || "[]");
        if (completedLevels.length % 10 === 0) {
            fetch("/api/mint-nft", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ address }),
            });
        }
    };

    useEffect(() => {
        getRandomWord();
    }, [difficulty, level]);

    useEffect(() => {
        fetchBalance();
    }, [address]);

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
        if (!targetWord) return; // ✅ prevent premature evaluation
      
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
      }, [guessedLetters, attempts, targetWord]);
      

    const handleReveal = () => getRandomWord();
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
                    <div style={{ border: "1px solid #4D6947", padding: "8px 16px", borderRadius: "86px" }}>
                        {address ? address.slice(0, 6) + "..." + address.slice(-4) : "Not Connected"}
                    </div>
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

            {/* Game Over Modal */}
            {gameOver && (
                <GameOverModal
                    isOpen={gameOver}
                    correct={targetWord.split("").filter((char) => guessedLetters.includes(char)).length}
                    total={targetWord.length}
                    reward={difficulty === "easy" ? 3 : difficulty === "medium" ? 6 : 9}
                    onHome={handleHome}
                    onNext={handleNext}
                />
            )}
        </div>
    );
};

export default PlayScreen;
