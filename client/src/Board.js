
import React, { useEffect, useState } from "react";
import Blocks from "./Blocks";
import Confetti from "react-confetti";

const Board = ({ winnername, playerName, room, username, socket }) => {
  const [state, setState] = useState(Array(9).fill(null));
  const [isXturn, setIsXturn] = useState(true);
  const [buttonEnable, setButtonEnable] = useState(true);
  const [scores, setScores] = useState({ X: 0, O: 0 });

  const handleClick = async (index) => {
    if (state[index] !== null || isWinner) {
      return;
    }
    const copyState = [...state];
    copyState[index] = isXturn ? "X" : "O";
    setState(copyState);
    setButtonEnable(true);
    const messageData = {
      room: room,
      author: username,
      buttonEnable: buttonEnable,
      state: copyState,
      isXturn: !isXturn,
    };
    await socket.emit("send_message", messageData);
  };

  useEffect(() => {
    socket.on("active_player", (data) => {
      console.log(data);
      setButtonEnable(false);
    });
  }, []);

  const checkWinner = () => {
    const winList = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i of winList) {
      const [a, b, c] = i;
      if (state[a] !== null && state[a] === state[b] && state[a] === state[c]) {
        return state[a];
      }
    }
    return null;
  };
  const isWinner = checkWinner();

  const winner = checkWinner();

  useEffect(() => {
    if (winner) {
      setScores((prevScores) => ({
        ...prevScores,
        [winner]: prevScores[winner] + 1,
      }));
    }
  }, [winner]);

  useEffect(() => {
    socket.on("enable_button", (data) => {
      setState(data.state);
      setButtonEnable(false);
      setIsXturn(data.isXturn);
    });
  }, [socket]);

  return (
    <>
      {winner && winnername === username && (
        <Confetti width={window.innerWidth} height={window.innerHeight} />
      )}
      <div className="container mt-5">
        {!winner ? (
          <h2>
            <span style={{ fontWeight: "600" }}>
              {!buttonEnable
                ? `Your Turn`
                : `${playerName ? `${playerName} Turn` : `Waiting for Turn `}`}
            </span>
          </h2>
        ) : (
          <h2>
            {winnername === username ? (
              <span style={{ fontWeight: "600" }}>Congrats</span>
            ) : (
              <span style={{ fontWeight: "600", color: "red" }}>You Loose</span>
            )}
          </h2>
        )}
        <div className="board-row row mt-5 g-3">
          {state.map((e, i) => (
            <div
              className="col-md-4 col-sm-4 col-4 d-flex justify-content-center"
              key={i}
            >
              {!buttonEnable ? (
                <Blocks onClick={() => handleClick(i)} value={state[i]} />
              ) : (
                <Blocks value={state[i]} />
              )}
            </div>
          ))}
        </div>
        <div className="winner">
          {winner ? (
            <>
              <h2>Winner: {winnername}</h2>
              <button
                className="btn btn-warning"
                onClick={() => setState(Array(9).fill(null))}
              >
                Play again
              </button>
            </>
          ) : !state.includes(null) && !winner ? (
            <>
              <h2>Draw Game</h2>
              <button
                className="btn btn-warning"
                style={{ borderRadius: 7 }}
                onClick={() => setState(Array(9).fill(null))}
              >
                Play again
              </button>
            </>
          ) : (
            ""
          )}
        </div>

        <div className="scores">
          <h2>Scores:</h2>
          <h5>Player X: {" " }{scores.X}</h5>
          <h5>Player O: {scores.O}</h5>
        </div>
      </div>
    </>
  );
};

export default Board;
