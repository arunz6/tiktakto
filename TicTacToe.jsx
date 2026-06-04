import { useState, useEffect, useCallback } from "react";

const WINNING_COMBOS = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function checkWinner(board) {
  for (const [a,b,c] of WINNING_COMBOS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c])
      return { winner: board[a], line: [a,b,c] };
  }
  if (board.every(Boolean)) return { winner: "draw", line: [] };
  return null;
}

function getBotMove(board, botSymbol, playerSymbol) {
  const empty = board.map((v,i) => v ? null : i).filter(v => v !== null);

  const tryWin = (sym) => {
    for (const [a,b,c] of WINNING_COMBOS) {
      const cells = [board[a], board[b], board[c]];
      const idxs = [a,b,c];
      const syms = cells.filter(v => v === sym).length;
      const empties = cells.filter(v => !v).length;
      if (syms === 2 && empties === 1) {
        return idxs[cells.indexOf(null)];
      }
    }
    return null;
  };

  const win = tryWin(botSymbol);
  if (win !== null) return win;
  const block = tryWin(playerSymbol);
  if (block !== null) return block;

  if (!board[4]) return 4;

  const corners = [0,2,6,8].filter(i => !board[i]);
  if (corners.length) return corners[Math.floor(Math.random() * corners.length)];

  return empty[Math.floor(Math.random() * empty.length)];
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #080b14;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Rajdhani', sans-serif;
  }

  .root {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    background: #080b14;
    position: relative;
    overflow: hidden;
  }

  .root::before {
    content: '';
    position: fixed;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(ellipse at 20% 20%, #0d1f3c 0%, transparent 50%),
                radial-gradient(ellipse at 80% 80%, #1a0d2e 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }

  .container {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 420px;
    min-width: 0;
  }

  .title {
    font-family: 'Orbitron', monospace;
    font-weight: 900;
    font-size: 2rem;
    text-align: center;
    letter-spacing: 0.15em;
    color: #e2e8f0;
    margin-bottom: 8px;
    text-shadow: 0 0 20px rgba(99,179,237,0.4);
  }

  .subtitle {
    text-align: center;
    font-size: 0.85rem;
    color: #4a5568;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    margin-bottom: 32px;
  }

  /* Setup screen */
  .setup-card {
    background: rgba(15,20,35,0.9);
    border: 1px solid rgba(99,179,237,0.15);
    border-radius: 20px;
    padding: 36px;
  }

  .field-label {
    font-size: 0.75rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #4a5568;
    margin-bottom: 8px;
    display: block;
  }

  .name-input {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(99,179,237,0.2);
    border-radius: 10px;
    padding: 12px 16px;
    font-size: 1rem;
    font-family: 'Rajdhani', sans-serif;
    font-weight: 600;
    color: #e2e8f0;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    margin-bottom: 24px;
  }

  .name-input:focus {
    border-color: rgba(99,179,237,0.5);
    box-shadow: 0 0 0 3px rgba(99,179,237,0.08);
  }

  .symbol-row {
    display: flex;
    gap: 12px;
    margin-bottom: 28px;
  }

  .symbol-btn {
    flex: 1;
    padding: 14px;
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.03);
    color: #718096;
    font-family: 'Orbitron', monospace;
    font-size: 1.5rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }

  .symbol-btn span {
    font-family: 'Rajdhani', sans-serif;
    font-size: 0.65rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .symbol-btn.active-x {
    border-color: rgba(99,179,237,0.6);
    background: rgba(99,179,237,0.1);
    color: #63b3ed;
    box-shadow: 0 0 16px rgba(99,179,237,0.15);
  }

  .symbol-btn.active-o {
    border-color: rgba(246,135,179,0.6);
    background: rgba(246,135,179,0.1);
    color: #f687b3;
    box-shadow: 0 0 16px rgba(246,135,179,0.15);
  }

  .diff-row {
    display: flex;
    gap: 8px;
    margin-bottom: 28px;
  }

  .diff-btn {
    flex: 1;
    padding: 8px;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.07);
    background: transparent;
    color: #4a5568;
    font-family: 'Rajdhani', sans-serif;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s;
  }

  .diff-btn.active {
    border-color: rgba(154,230,180,0.5);
    background: rgba(154,230,180,0.08);
    color: #9ae6b4;
  }

  .start-btn {
    width: 100%;
    padding: 16px;
    border-radius: 12px;
    border: none;
    background: linear-gradient(135deg, #2b6cb0, #553c9a);
    color: #e2e8f0;
    font-family: 'Orbitron', monospace;
    font-size: 0.85rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.1s;
  }

  .start-btn:hover { opacity: 0.9; }
  .start-btn:active { transform: scale(0.98); }

  /* Game screen */
  .score-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
    gap: 8px;
  }

  .score-card {
    flex: 1;
    background: rgba(15,20,35,0.9);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 14px;
    padding: 14px 10px;
    text-align: center;
  }

  .score-card.player-card { border-color: rgba(99,179,237,0.25); }
  .score-card.bot-card { border-color: rgba(246,135,179,0.25); }
  .score-card.draw-card { border-color: rgba(255,255,255,0.07); }

  .score-label {
    font-size: 0.65rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #4a5568;
    margin-bottom: 4px;
  }

  .score-name {
    font-size: 0.8rem;
    font-weight: 600;
    color: #718096;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 90px;
    margin: 0 auto 4px;
  }

  .score-num {
    font-family: 'Orbitron', monospace;
    font-size: 1.6rem;
    font-weight: 700;
  }

  .score-num.player-score { color: #63b3ed; }
  .score-num.bot-score { color: #f687b3; }
  .score-num.draw-score { color: #718096; }

  .status-bar {
    text-align: center;
    font-size: 0.9rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    color: #718096;
    margin-bottom: 20px;
    height: 22px;
    transition: color 0.3s;
  }

  .status-bar.player-turn { color: #63b3ed; }
  .status-bar.bot-turn { color: #f687b3; }
  .status-bar.win { color: #9ae6b4; }
  .status-bar.lose { color: #fc8181; }
  .status-bar.draw-status { color: #f6ad55; }

  .board {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-bottom: 20px;
    background: rgba(15,20,35,0.9);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 20px;
    padding: 16px;
  }

  .cell {
    aspect-ratio: 1;
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.07);
    background: rgba(255,255,255,0.02);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Orbitron', monospace;
    font-size: 2rem;
    font-weight: 900;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s, transform 0.1s;
    user-select: none;
    position: relative;
    overflow: hidden;
  }

  .cell:hover:not(.taken):not(.disabled) {
    background: rgba(255,255,255,0.05);
    border-color: rgba(99,179,237,0.3);
    transform: scale(1.02);
  }

  .cell.taken { cursor: default; }
  .cell.disabled { cursor: not-allowed; }

  .cell.x-cell {
    color: #63b3ed;
    border-color: rgba(99,179,237,0.25);
    background: rgba(99,179,237,0.06);
  }

  .cell.o-cell {
    color: #f687b3;
    border-color: rgba(246,135,179,0.25);
    background: rgba(246,135,179,0.06);
  }

  .cell.winner-cell {
    animation: pulse-win 1s ease infinite;
  }

  .cell.x-cell.winner-cell { box-shadow: 0 0 20px rgba(99,179,237,0.3); }
  .cell.o-cell.winner-cell { box-shadow: 0 0 20px rgba(246,135,179,0.3); }

  @keyframes pulse-win {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.06); }
  }

  @keyframes pop-in {
    0% { transform: scale(0.5); opacity: 0; }
    60% { transform: scale(1.1); }
    100% { transform: scale(1); opacity: 1; }
  }

  .cell-symbol {
    animation: pop-in 0.2s cubic-bezier(0.34,1.56,0.64,1) forwards;
  }

  .actions-row {
    display: flex;
    gap: 10px;
  }

  .action-btn {
    flex: 1;
    padding: 12px;
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.03);
    color: #718096;
    font-family: 'Rajdhani', sans-serif;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s;
  }

  .action-btn:hover {
    background: rgba(255,255,255,0.07);
    color: #e2e8f0;
  }

  .action-btn.primary {
    border-color: rgba(99,179,237,0.3);
    color: #63b3ed;
  }

  .action-btn.primary:hover {
    background: rgba(99,179,237,0.1);
  }

  .diff-badge {
    text-align: center;
    font-size: 0.65rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #2d3748;
    margin-top: 12px;
  }

  /* ── Mobile ── */
  @media (max-width: 480px) {
    .root { padding: 12px; align-items: flex-start; padding-top: 24px; }

    .container { max-width: 100%; }

    .title { font-size: 1.4rem; letter-spacing: 0.1em; }
    .subtitle { font-size: 0.7rem; margin-bottom: 20px; }

    .setup-card { padding: 24px 18px; border-radius: 16px; }

    .name-input { padding: 10px 14px; font-size: 0.95rem; }

    .symbol-btn { padding: 10px 8px; font-size: 1.2rem; }

    .diff-btn { font-size: 0.7rem; padding: 7px 4px; }

    .score-bar { gap: 6px; margin-bottom: 16px; }
    .score-card { padding: 10px 6px; border-radius: 10px; }
    .score-label { font-size: 0.58rem; }
    .score-name { font-size: 0.7rem; max-width: 68px; }
    .score-num { font-size: 1.3rem; }

    .status-bar { font-size: 0.8rem; margin-bottom: 14px; }

    .board { gap: 7px; padding: 12px; border-radius: 16px; }
    .cell { border-radius: 10px; font-size: 1.5rem; }

    .action-btn { padding: 10px 8px; font-size: 0.7rem; }
    .actions-row { gap: 8px; }
  }

  @media (max-width: 360px) {
    .title { font-size: 1.2rem; }
    .score-num { font-size: 1.1rem; }
    .cell { font-size: 1.25rem; }
    .score-name { max-width: 56px; font-size: 0.65rem; }
  }
`;

export default function TicTacToe() {
  const [screen, setScreen] = useState("setup");
  const [playerName, setPlayerName] = useState("");
  const [playerSymbol, setPlayerSymbol] = useState("X");
  const [difficulty, setDifficulty] = useState("medium");

  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [gameResult, setGameResult] = useState(null);
  const [winLine, setWinLine] = useState([]);
  const [scores, setScores] = useState({ player: 0, bot: 0, draw: 0 });
  const [botThinking, setBotThinking] = useState(false);

  const botSymbol = playerSymbol === "X" ? "O" : "X";

  const getStatusText = () => {
    if (gameResult) {
      if (gameResult === "draw") return "It's a draw!";
      if (gameResult === "player") return `${playerName || "You"} wins! 🎉`;
      return "Bot wins!";
    }
    if (botThinking) return "Bot is thinking...";
    if (isPlayerTurn) return `${playerName || "Your"} turn`;
    return "Bot's turn";
  };

  const getStatusClass = () => {
    if (gameResult === "player") return "win";
    if (gameResult === "bot") return "lose";
    if (gameResult === "draw") return "draw-status";
    if (!isPlayerTurn || botThinking) return "bot-turn";
    return "player-turn";
  };

  const smartBotMove = useCallback((b) => {
    if (difficulty === "easy") {
      const empty = b.map((v,i) => v ? null : i).filter(v => v !== null);
      return empty[Math.floor(Math.random() * empty.length)];
    }
    if (difficulty === "hard") return getBotMove(b, botSymbol, playerSymbol);
    // medium: 70% smart
    if (Math.random() < 0.7) return getBotMove(b, botSymbol, playerSymbol);
    const empty = b.map((v,i) => v ? null : i).filter(v => v !== null);
    return empty[Math.floor(Math.random() * empty.length)];
  }, [difficulty, botSymbol, playerSymbol]);

  const handleBotTurn = useCallback((b) => {
    setBotThinking(true);
    const delay = difficulty === "easy" ? 400 : difficulty === "hard" ? 900 : 600;
    setTimeout(() => {
      const move = smartBotMove(b);
      if (move === undefined) return;
      const next = [...b];
      next[move] = botSymbol;
      const result = checkWinner(next);
      setBoard(next);
      setBotThinking(false);
      if (result) {
        setWinLine(result.line);
        if (result.winner === "draw") {
          setGameResult("draw");
          setScores(s => ({ ...s, draw: s.draw + 1 }));
        } else {
          setGameResult("bot");
          setScores(s => ({ ...s, bot: s.bot + 1 }));
        }
      } else {
        setIsPlayerTurn(true);
      }
    }, delay);
  }, [smartBotMove, botSymbol, difficulty]);

  const handleCellClick = (i) => {
    if (!isPlayerTurn || board[i] || gameResult || botThinking) return;
    const next = [...board];
    next[i] = playerSymbol;
    const result = checkWinner(next);
    setBoard(next);
    if (result) {
      setWinLine(result.line);
      if (result.winner === "draw") {
        setGameResult("draw");
        setScores(s => ({ ...s, draw: s.draw + 1 }));
      } else {
        setGameResult("player");
        setScores(s => ({ ...s, player: s.player + 1 }));
      }
    } else {
      setIsPlayerTurn(false);
      handleBotTurn(next);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setGameResult(null);
    setWinLine([]);
    setBotThinking(false);
    setIsPlayerTurn(true);
  };

  const goHome = () => {
    resetGame();
    setScores({ player: 0, bot: 0, draw: 0 });
    setScreen("setup");
  };

  const startGame = () => {
    if (!playerName.trim()) return;
    resetGame();
    setScreen("game");
  };

  return (
    <>
      <style>{styles}</style>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <div className="root">
        <div className="container">
          <div className="title">TIC TAC TOE</div>
          <div className="subtitle">vs AI opponent</div>

          {screen === "setup" ? (
            <div className="setup-card">
              <label className="field-label">Your name</label>
              <input
                className="name-input"
                value={playerName}
                onChange={e => setPlayerName(e.target.value)}
                onKeyDown={e => e.key === "Enter" && startGame()}
                placeholder="Enter your name..."
                maxLength={16}
                autoFocus
              />

              <label className="field-label">Choose your symbol</label>
              <div className="symbol-row">
                <button
                  className={`symbol-btn ${playerSymbol === "X" ? "active-x" : ""}`}
                  onClick={() => setPlayerSymbol("X")}
                >
                  X
                  <span>First</span>
                </button>
                <button
                  className={`symbol-btn ${playerSymbol === "O" ? "active-o" : ""}`}
                  onClick={() => setPlayerSymbol("O")}
                >
                  O
                  <span>Second</span>
                </button>
              </div>

              <label className="field-label">Difficulty</label>
              <div className="diff-row">
                {["easy","medium","hard"].map(d => (
                  <button
                    key={d}
                    className={`diff-btn ${difficulty === d ? "active" : ""}`}
                    onClick={() => setDifficulty(d)}
                  >
                    {d}
                  </button>
                ))}
              </div>

              <button className="start-btn" onClick={startGame} disabled={!playerName.trim()}>
                START GAME
              </button>
            </div>
          ) : (
            <>
              <div className="score-bar">
                <div className="score-card player-card">
                  <div className="score-label">You ({playerSymbol})</div>
                  <div className="score-name">{playerName}</div>
                  <div className="score-num player-score">{scores.player}</div>
                </div>
                <div className="score-card draw-card">
                  <div className="score-label">Draw</div>
                  <div className="score-name">–</div>
                  <div className="score-num draw-score">{scores.draw}</div>
                </div>
                <div className="score-card bot-card">
                  <div className="score-label">Bot ({botSymbol})</div>
                  <div className="score-name">AI</div>
                  <div className="score-num bot-score">{scores.bot}</div>
                </div>
              </div>

              <div className={`status-bar ${getStatusClass()}`}>
                {getStatusText()}
              </div>

              <div className="board">
                {board.map((val, i) => (
                  <div
                    key={i}
                    className={`cell ${val === "X" ? "x-cell" : val === "O" ? "o-cell" : ""} ${val ? "taken" : ""} ${(!isPlayerTurn || gameResult || botThinking) && !val ? "disabled" : ""} ${winLine.includes(i) ? "winner-cell" : ""}`}
                    onClick={() => handleCellClick(i)}
                  >
                    {val && <span className="cell-symbol">{val}</span>}
                  </div>
                ))}
              </div>

              <div className="actions-row">
                <button className="action-btn primary" onClick={resetGame}>
                  New Round
                </button>
                <button className="action-btn" onClick={goHome}>
                  Change Setup
                </button>
              </div>

              <div className="diff-badge">{difficulty} difficulty</div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
