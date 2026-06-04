import { useState, useCallback } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────
const WINNING_COMBOS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // rows
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // cols
  [0, 4, 8],
  [2, 4, 6], // diags
];

const DIFFICULTY_CONFIG = {
  easy: {
    label: "Easy",
    color: "text-emerald-400 border-emerald-400",
    activeBg: "bg-emerald-400 text-zinc-900",
  },
  medium: {
    label: "Medium",
    color: "text-amber-400 border-amber-400",
    activeBg: "bg-amber-400 text-zinc-900",
  },
  hard: {
    label: "Hard",
    color: "text-rose-400 border-rose-400",
    activeBg: "bg-rose-400 text-zinc-900",
  },
};

// ─── AI Logic ─────────────────────────────────────────────────────────────────
function getWinner(board) {
  for (const [a, b, c] of WINNING_COMBOS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c])
      return { winner: board[a], combo: [a, b, c] };
  }
  return null;
}

function minimax(board, isMaximizing) {
  const result = getWinner(board);
  if (result?.winner === "O") return 10;
  if (result?.winner === "X") return -10;
  if (board.every(Boolean)) return 0;

  const empty = board
    .map((v, i) => (v === null ? i : null))
    .filter((v) => v !== null);

  if (isMaximizing) {
    let best = -Infinity;
    for (const i of empty) {
      const next = [...board];
      next[i] = "O";
      best = Math.max(best, minimax(next, false));
    }
    return best;
  } else {
    let best = Infinity;
    for (const i of empty) {
      const next = [...board];
      next[i] = "X";
      best = Math.min(best, minimax(next, true));
    }
    return best;
  }
}

function findWinMove(board, mark) {
  for (const [a, b, c] of WINNING_COMBOS) {
    const cells = [board[a], board[b], board[c]];
    const idxs = [a, b, c];
    if (cells.filter((v) => v === mark).length === 2 && cells.includes(null))
      return idxs[cells.indexOf(null)];
  }
  return -1;
}

function getAIMove(board, difficulty) {
  const empty = board
    .map((v, i) => (v === null ? i : null))
    .filter((v) => v !== null);
  if (!empty.length) return -1;

  if (difficulty === "easy") {
    // 75% random, 25% smart
    if (Math.random() < 0.75)
      return empty[Math.floor(Math.random() * empty.length)];
    return minimax_best(board);
  }

  if (difficulty === "medium") {
    const win = findWinMove(board, "O");
    if (win !== -1) return win;
    const block = findWinMove(board, "X");
    if (block !== -1) return block;
    // 45% random rest
    if (Math.random() < 0.45)
      return empty[Math.floor(Math.random() * empty.length)];
    return minimax_best(board);
  }

  // hard — perfect minimax
  return minimax_best(board);
}

function minimax_best(board) {
  const empty = board
    .map((v, i) => (v === null ? i : null))
    .filter((v) => v !== null);
  let bestScore = -Infinity;
  let bestMove = empty[0];
  for (const i of empty) {
    const next = [...board];
    next[i] = "O";
    const score = minimax(next, false);
    if (score > bestScore) {
      bestScore = score;
      bestMove = i;
    }
  }
  return bestMove;
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function Cell({ value, index, isWinning, onClick, disabled }) {
  return (
    <button
      onClick={() => onClick(index)}
      disabled={disabled || !!value}
      className={`
        aspect-square w-full rounded-2xl border transition-all duration-150
        flex items-center justify-center text-4xl font-black select-none
        ${
          isWinning
            ? value === "X"
              ? "border-rose-400 bg-rose-400/10 animate-pulse"
              : "border-sky-400 bg-sky-400/10 animate-pulse"
            : "border-zinc-700 bg-zinc-800/60"
        }
        ${
          !value && !disabled
            ? "hover:bg-zinc-700/70 hover:border-zinc-500 hover:scale-105 cursor-pointer active:scale-95"
            : "cursor-default"
        }
      `}
    >
      {value === "X" && (
        <span className="text-rose-400 drop-shadow-[0_0_8px_rgba(251,113,133,0.6)]">
          ✕
        </span>
      )}
      {value === "O" && (
        <span className="text-sky-400 drop-shadow-[0_0_8px_rgba(56,189,248,0.6)]">
          ○
        </span>
      )}
    </button>
  );
}

function ScorePill({ label, value, color }) {
  return (
    <div
      className={`flex flex-col items-center px-5 py-2 rounded-xl border ${color} bg-zinc-800/50 min-w-[72px]`}
    >
      <span className="text-xs font-semibold tracking-widest uppercase opacity-70">
        {label}
      </span>
      <span className="text-2xl font-black tabular-nums">{value}</span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function TicTacToe({ nameofuser }) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [gameOver, setGameOver] = useState(false);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [status, setStatus] = useState("Your turn");
  const [winCombo, setWinCombo] = useState([]);
  const [difficulty, setDifficulty] = useState("medium");
  const [scores, setScores] = useState({ you: 0, draw: 0, ai: 0 });
  const [isThinking, setIsThinking] = useState(false);

  const resetBoard = useCallback(
    (diff = difficulty) => {
      setBoard(Array(9).fill(null));
      setGameOver(false);
      setIsPlayerTurn(true);
      setWinCombo([]);
      setIsThinking(false);
      setStatus("Your turn");
    },
    [difficulty],
  );

  const handleDifficulty = (d) => {
    setDifficulty(d);
    resetBoard(d);
  };

  const processMove = useCallback((newBoard, mark) => {
    const result = getWinner(newBoard);
    if (result) {
      setWinCombo(result.combo);
      setGameOver(true);
      if (result.winner === "X") {
        setScores((s) => ({ ...s, you: s.you + 1 }));
        setStatus("🎉 You win!");
      } else {
        setScores((s) => ({ ...s, ai: s.ai + 1 }));
        setStatus("🤖 AI wins!");
      }
      return true;
    }
    if (newBoard.every(Boolean)) {
      setGameOver(true);
      setScores((s) => ({ ...s, draw: s.draw + 1 }));
      setStatus("It's a draw!");
      return true;
    }
    return false;
  }, []);

  const handleCellClick = useCallback(
    (index) => {
      if (gameOver || !isPlayerTurn || board[index] || isThinking) return;

      const newBoard = [...board];
      newBoard[index] = "X";
      setBoard(newBoard);

      if (processMove(newBoard, "X")) return;

      setIsPlayerTurn(false);
      setIsThinking(true);
      setStatus("AI thinking…");

      const delay =
        difficulty === "easy" ? 400 : difficulty === "medium" ? 550 : 750;
      setTimeout(() => {
        const aiIndex = getAIMove(newBoard, difficulty);
        if (aiIndex === -1) return;
        const afterAI = [...newBoard];
        afterAI[aiIndex] = "O";
        setBoard(afterAI);
        setIsThinking(false);
        if (!processMove(afterAI, "O")) {
          setIsPlayerTurn(true);
          setStatus("Your turn");
        }
      }, delay);
    },
    [board, gameOver, isPlayerTurn, isThinking, difficulty, processMove],
  );

  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-1 font-mono">
      <div className="w-full max-w-sm flex flex-col items-center scale-80  justify-center overflow-clip ">
        {/* Title */}
        <div className="text-center">
          <h1 className="text-3xl font-black tracking-tight text-white">
            <span className="text-rose-400">Tic</span>
            <span className="text-zinc-500"> × </span>
            <span className="text-sky-400">Tac</span>
            <span className="text-zinc-500"> × </span>
            <span className="text-white">Toe</span>
          </h1>
          <p className="text-zinc-500 text-xs tracking-widest mt-1 uppercase">
            You (X) vs AI (O)
          </p>
        </div>
        {/* {name} */}
        <div className="name">
          <h2 className="text-zinc-500 text-xs tracking-widest mt-1 uppercase">
            NAME:{nameofuser}
          </h2>
        </div>

        {/* Difficulty selector */}
        <div className="flex gap-2 bg-zinc-800 rounded-2xl p-1.5 border border-zinc-700">
          {Object.entries(DIFFICULTY_CONFIG).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => handleDifficulty(key)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold tracking-widest uppercase transition-all duration-150 border
                ${
                  difficulty === key
                    ? `${cfg.activeBg} border-transparent shadow-lg`
                    : `bg-transparent ${cfg.color} hover:bg-zinc-700`
                }`}
            >
              {cfg.label}
            </button>
          ))}
        </div>

        {/* Score row */}
        <div className="flex gap-3 items-center">
          <ScorePill
            label="You"
            value={scores.you}
            color="border-rose-400/40 text-rose-400"
          />
          <ScorePill
            label="Draw"
            value={scores.draw}
            color="border-zinc-600 text-zinc-400"
          />
          <ScorePill
            label="AI"
            value={scores.ai}
            color="border-sky-400/40 text-sky-400"
          />
        </div>

        {/* Status */}
        <div
          className={`
          px-5 py-2 rounded-full border text-sm font-bold tracking-wide transition-all duration-300
          ${
            gameOver
              ? status.includes("You win")
                ? "border-emerald-400 text-emerald-400 bg-emerald-400/10"
                : status.includes("AI wins")
                  ? "border-rose-400 text-rose-400 bg-rose-400/10"
                  : "border-zinc-500 text-zinc-400 bg-zinc-800"
              : isThinking
                ? "border-sky-400/50 text-sky-400 animate-pulse"
                : "border-zinc-600 text-zinc-300"
          }
        `}
        >
          {status}
        </div>

        {/* Board */}
        <div className="w-full grid grid-cols-3 gap-3">
          {board.map((value, i) => (
            <Cell
              key={i}
              index={i}
              value={value}
              isWinning={winCombo.includes(i)}
              onClick={handleCellClick}
              disabled={gameOver || !isPlayerTurn || isThinking}
            />
          ))}
        </div>

        {/* Controls */}
        <div className="flex gap-3 w-full">
          <button
            onClick={() => resetBoard()}
            className="flex-1 py-2.5 rounded-xl border border-zinc-600 text-zinc-300 text-sm font-bold
              hover:bg-zinc-700 hover:border-zinc-500 transition-all active:scale-95"
          >
            New Round
          </button>
          <button
            onClick={() => {
              setScores({ you: 0, draw: 0, ai: 0 });
              resetBoard();
            }}
            className="flex-1 py-2.5 rounded-xl border border-rose-500/50 text-rose-400 text-sm font-bold
              hover:bg-rose-500/10 transition-all active:scale-95"
          >
            Reset All
          </button>
        </div>

        {/* Difficulty hint */}
        <p className="text-zinc-600 text-xs text-center tracking-wide">
          {difficulty === "easy" && "Easy — AI makes lots of random moves 😄"}
          {difficulty === "medium" &&
            "Medium — AI blocks & attacks, but slips 🤔"}
          {difficulty === "hard" && "Hard — Perfect AI. You can only draw. 😈"}
        </p>
      </div>
    </div>
  );
}
