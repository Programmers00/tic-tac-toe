import "./App.css";

function Players() {
  return (
    <div className="players">
      <div className="player player1">
        <span>Player1</span>
        <span>O</span>
      </div>
      <div className="player player2">
        <span>Player2</span>
        <span>X</span>
      </div>
    </div>
  );
}

function Board() {
  return (
    <div className="boardContainer">
      <div className="boardRow">
        <Box />
        <Box />
        <Box />
      </div>
      <div className="boardRow">
        <Box />
        <Box />
        <Box />
      </div>
      <div className="boardRow">
        <Box />
        <Box />
        <Box />
      </div>
    </div>
  );
}

function Box() {
  return <div className="box"></div>;
}

function Button() {
  return <div className="button">Button</div>;
}

function App() {
  return (
    <div className="mainContainer">
      <div className="main">
        <Players />
        <Board />
        <Button />
      </div>
    </div>
  );
}

export default App;
