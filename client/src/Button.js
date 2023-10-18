// eslint-disable-next-line
import React, { useEffect, useState } from "react";
import ScrollToBottom, { FunctionContext } from "react-scroll-to-bottom";
import { Icon } from "@iconify/react";
import ReactiveButton from "reactive-button";
import Board from "./Board";
import { useNavigate } from "react-router-dom";

function Button({ socket, username, room }) {
  const NumberofUser = localStorage.getItem("usercount");
  const onlinePlayers = localStorage.getItem("onlinePlayers");
  const [roomID, setRoomID] = useState();
  const [currentMessage, setCurrentMessage] = useState("");
  const [buttonEnable, setButtonEnable] = useState(true);
  const [userDetails, setUserDetails] = useState();
  const [state, setState] = useState("idle");
  const [playerName, setPlayerName] = useState();
  const [totalClickCount, setTotalClickCount] = useState(0);
  const [winner, setWinner] = useState("");
  const navigate = useNavigate();

  const onClickHandler = () => {
    setState("loading");
    sendMessage();
    setTimeout(() => {
      setState("success");
    }, 500);
  };

  const sendMessage = async () => {
    setButtonEnable(true);
    const messageData = {
      room: room,
      author: username,
      message: currentMessage,
      buttonEnable: buttonEnable,
      time:
        new Date(Date.now()).getHours() +
        ":" +
        new Date(Date.now()).getMinutes(),
    };
    await socket.emit("send_message", messageData);
  };

  useEffect(() => {
    socket.on("player_name", (playerName) => {
      setPlayerName(playerName);
      console.log(playerName);
    });

    socket.on("total_click_count", (count) => {
      setTotalClickCount(count);
    });

    socket.on("room_id", (id) => {
      setRoomID(id);
    });

    socket.on("win_player", (data) => {
      setWinner(data);
    });
  }, [socket]);

  useEffect(() => {
    socket.on("active_player", (data) => {
      console.log(data);
      setButtonEnable(false);
    });
  }, []);

  function backbtn() {
    navigate(-1);
  }

  return (
    <div className="container p-2 mt-2 align-items-center">
      <h4 class="text-white mb-2">
        Hi 👋, <b>{username}</b>
      </h4>
      <div className="d-flex justify-content-between ">
        <div>
          <div className="text-white">
            <b>Room Id: </b>
            {roomID}
          </div>
        </div>
        <div>
          <div className="text-white">
            <b>OnlinePlayers: </b>
            {onlinePlayers}
          </div>
        </div>
      </div>
      <div class=" text-center shaow"></div>
      <Board
        winnername={winner}
        playerName={playerName}
        room={room}
        username={username}
        socket={socket}
        buttonEnable={buttonEnable}
      />
      <button
        className="btn btn-danger  "
        style={{ borderRadius: 15, width: "150px", color: "white" }}
        onClick={backbtn}
      >
        Exit Game
      </button>
    </div>
  );
}
export default Button;
