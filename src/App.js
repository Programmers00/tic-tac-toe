/** css */
import "./App.css";
/** hook */
import { useState, useEffect } from "react";
/** class */
import PlayerClass from "./class/PlayerClass";
import GameClass from "./class/GameClass";
import BoardClass from "./class/BoardClass";

/** Player component */
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
      {/* create array by board size */}
      {Array.from({ length: board.boardSize }, (value, index) => index)
        .reduce((rows, id) => {
          const index = Math.floor(id / board.boardLength);
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

      /** change next player */
      setGame((prevGame) => ({
        ...prevGame,
        selectedPlayer: prevGame.selectedPlayer === "O" ? "X" : "O", //change player
        maxGameCount: prevGame.maxGameCount - 1,
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
const Button = ({ title, onClick }) => {
  return (
    <div className="button" onClick={onClick}>
      {title}
    </div>
  );
};

/** Modal component */
const Modal = ({ winner, onReset, isModal, setIsModal }) => {
  /****** state manage ******/
  // delay modal open
  const [delayModal, setDelayModal] = useState(false);
  // delay 0.2 seconds open modal
  useEffect(() => {
    setTimeout(() => {
      setDelayModal(true);
    }, 200);
  }, [isModal]);

  /****** functions ******/
  /** restart: close modal and reset */
  const onRestart = () => {
    setIsModal(false);
    onReset();
  };

  return (
    <div className={`modalBox ${delayModal ? "open" : "close"}`}>
      <div className="content">
        {/* winner is => show winner / winners is none => show draw */}
        {winner !== "" ? (
          <>
            <div className="before"></div>
            <div className="after"></div>
            <span>WINNER!</span>
          </>
        ) : (
          <span>DRAW!</span>
        )}
        <span className="winner">{winner}</span>
        <Button title="Restart" onClick={onRestart} />
      </div>
    </div>
  );
};

const App = () => {
  /****** const data ******/
  const BOARD_LENGTH = 3;
  const BOARD_SIZE = BOARD_LENGTH ** 2;

  /****** create objects ******/
  /** create players */
  const [o, setO] = useState(new PlayerClass("O", [], true));
  const [x, setX] = useState(new PlayerClass("X", [], false));

  /** create board */
  const [board, setBoard] = useState(
    new BoardClass(Array(BOARD_SIZE).fill(null), BOARD_LENGTH)
  );

  /** create game */
  const [game, setGame] = useState(new GameClass("O", BOARD_SIZE));

  /****** state manage ******/
  /** show modal */
  const [isModal, setIsModal] = useState(false);

  /** winner */
  const [winner, setWinner] = useState("");

  /** game */

  /****** trigger functions  ******/
  /** check winner o */
  useEffect(() => {
    checkWinner(o);
  }, [o]);

  /** check winner x */
  useEffect(() => {
    checkWinner(x);
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
  /** check who is winner or draw */
  const checkWinner = (player) => {
    const LAST_TURN = 0; //game last turn
    let sameIndexCount; //checker same index count
    // check who is winner
    winnerLines.some((line) => {
      sameIndexCount = player.status.filter((status) =>
        line.includes(status)
      ).length;
      // if index count same board length => show modal, winner
      if (sameIndexCount === BOARD_LENGTH) {
        setIsModal(true);
        setWinner(player.mark);
        return true;
      }
    });
    // check draw
    if (sameIndexCount !== BOARD_LENGTH && game.maxGameCount === LAST_TURN) {
      setWinner("");
      setIsModal(true);
    }
  };

  /** reset game, board, players */
  const onReset = () => {
    setGame(new GameClass("O", BOARD_SIZE));
    setBoard(new BoardClass(Array(BOARD_SIZE).fill(null), BOARD_LENGTH));
    setO(new PlayerClass("O", [], true));
    setX(new PlayerClass("X", [], false));
  };

  return (
    <div className="mainContainer">
      {isModal && (
        <Modal
          winner={winner}
          onReset={onReset}
          setIsModal={setIsModal}
          isModal={isModal}
        />
      )}

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
        <Button onClick={onReset} title="Reset" />
      </div>
    </div>
  );
};

export default App;
