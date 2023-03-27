/** css */
import "./App.css";
/** hook */
import { useState, useEffect } from "react";
/** class */
import PlayerClass from "./class/PlayerClass";
import GameClass from "./class/GameClass";
import BoardClass from "./class/BoardClass";

/** Board component */
const Player = ({ mark, color, selected }) => {
  return (
    <div className={`player + ${color} + ${selected && "selectedPlayer"}`}>
      <span>{mark}</span>
    </div>
  );
};

/** Board component */
const Board = ({ board, setBoard, setGame, player, setPlayer }) => {
  return (
    <div className="boardContainer">
      {[0, 1, 2, 3, 4, 5, 6, 7, 8]
        .reduce((rows, id) => {
          const index = Math.floor(id / 3);
          rows[index] = rows[index] || [];
          rows[index].push(
            <Box
              key={id}
              id={id}
              board={board}
              setBoard={setBoard}
              setGame={setGame}
              player={player}
              setPlayer={setPlayer}
            />
          );
          return rows;
        }, [])
        .map((row, index) => (
          <div key={index} className="boardRow">
            {row}
          </div>
        ))}
    </div>
  );
};

/** Box component */
const Box = ({ id, board, setBoard, setGame, player, setPlayer }) => {
  const onClickBox = () => {
    /** emplty box check */
    if (board.status[id] === null) {
      /** update player status */
      setPlayer((prevPlayer) => ({
        ...prevPlayer,
        status: [...prevPlayer.status, id],
      }));

      /** update board status */
      const newBoardStatus = [...board.status];
      newBoardStatus[id] = player.mark;
      setBoard((prevBoard) => ({
        ...prevBoard,
        status: newBoardStatus,
      }));

      /** change player */
      setGame((prevGame) => ({
        ...prevGame,
        selectedPlayer: prevGame.selectedPlayer === "O" ? "X" : "O",
      }));
    } else {
      console.log("##this box is already taken");
    }
  };
  return (
    <div className="box" onClick={onClickBox}>
      <div className="mark">{board.status[id]}</div>
    </div>
  );
};

/** Button component */
const Button = ({ onClick }) => {
  return (
    <div className="button" onClick={onClick}>
      Reset
    </div>
  );
};

const App = () => {
  /** create players */
  const [o, setO] = useState(new PlayerClass("O", "lightGreen", [], true));
  const [x, setX] = useState(new PlayerClass("X", "darkGreen", [], false));

  /** create board */
  const [board, setBoard] = useState(new BoardClass(Array(9).fill(null)));

  /** create game */
  const [game, setGame] = useState(new GameClass("O", true));

  /****** useeffect  ******/
  /** check winners o */
  useEffect(() => {
    checkWinners(o);
  }, [o]);

  /** check winners x */
  useEffect(() => {
    checkWinners(x);
  }, [x]);

  /****** constant data ******/
  const winnerLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  /****** functions ******/
  /** check winners */
  const checkWinners = (player) => {
    winnerLines.forEach((line) => {
      const length = player.status.filter((status) =>
        line.includes(status)
      ).length;
      if (length === 3) {
        // set madal(reset Button)
        console.log("Winner", player.mark);
      }
    });
  };

  /** reset game, board, players */
  const onReset = () => {
    setGame(new GameClass("O"));
    setBoard(new BoardClass(Array(9).fill(null)));
    setO(new PlayerClass("O", "lightGreen", [], true));
    setX(new PlayerClass("X", "darkGreen", [], false));
  };

  return (
    <div className="mainContainer">
      <div className="main">
        <div className="players">
          <Player
            mark={o.mark}
            color={o.color}
            status={o.status}
            selected={game.selectedPlayer === "O"}
          />
          <Player
            mark={x.mark}
            color={x.color}
            status={x.status}
            selected={game.selectedPlayer === "X"}
          />
        </div>
        <Board
          board={board}
          setBoard={setBoard}
          setGame={setGame}
          player={game.selectedPlayer === "O" ? o : x}
          setPlayer={game.selectedPlayer === "O" ? setO : setX}
        />
        <Button onClick={onReset} />
      </div>
    </div>
  );
};

export default App;
