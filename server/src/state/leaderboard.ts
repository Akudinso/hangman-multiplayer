/**
 * 🧠 In-memory leaderboard state.
 * This tracks per-wallet stats such as games played, wins, tokens, and NFTs.
 */

type PlayerStats = {
    gamesPlayed: number;
    gamesWon: number;
    tokensEarned: number;
    nftsClaimed: number;
};

const leaderboard: Record<string, PlayerStats> = {};

/**
 * 🏆 Called when a player wins a game.
 * Updates their stats based on game outcome.
 */
export function recordWin(winnerWallet: string) {
    if (!leaderboard[winnerWallet]) {
        leaderboard[winnerWallet] = {
            gamesPlayed: 0,
            gamesWon: 0,
            tokensEarned: 0,
            nftsClaimed: 0,
        };
    }

    leaderboard[winnerWallet].gamesPlayed += 1;
    leaderboard[winnerWallet].gamesWon += 1;
    leaderboard[winnerWallet].tokensEarned += 10; // Fixed token reward
    leaderboard[winnerWallet].nftsClaimed += 1;
}

/**
 * 🧾 Called when a player plays but doesn't win.
 */
export function recordLoss(wallet: string) {
    if (!leaderboard[wallet]) {
        leaderboard[wallet] = {
            gamesPlayed: 0,
            gamesWon: 0,
            tokensEarned: 0,
            nftsClaimed: 0,
        };
    }

    leaderboard[wallet].gamesPlayed += 1;
}

/**
 * 🧮 Returns the full leaderboard sorted by gamesWon.
 * Useful for frontend display or socket API.
 */
export function getLeaderboard(): {
    wallet: string;
    gamesPlayed: number;
    gamesWon: number;
    tokensEarned: number;
    nftsClaimed: number;
  }[] {
    return Object.entries(leaderboard)
        .map(([wallet, stats]) => ({ wallet, ...stats }))
        .sort((a, b) => b.gamesWon - a.gamesWon);
}
