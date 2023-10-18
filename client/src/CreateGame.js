import "./App.css";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import Button from "./Button";
import { useNavigate } from "react-router-dom";

const socket = io.connect("http://localhost:3001");

function CreateGame() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [goInside, setGoInside] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const [onlinePlayers, setOnlinePlayers] = useState(0);
  const navigate = useNavigate();
  localStorage.setItem("usercount", userCount);
  localStorage.setItem("onlinePlayers", onlinePlayers);
  const [activeUsers, setActiveUsers] = useState([]);


  useEffect(() => {
    socket.on("room_available", () => {

    });
  
    return () => {
      socket.off("room_available");
    };
  }, []);
  
  useEffect(() => {
    socket.on("active_users", (users) => {
      setActiveUsers(users);
    });
  
    return () => {
      socket.off("active_users");
    };
  }, []);

  useEffect(() => {
    socket.on("user_count", (count) => {
      setUserCount(count);
    });

    return () => {
      socket.off("user_count");
    };
  }, []);

  useEffect(() => {
    socket.on("player_status", (statusObj) => {
      const onlineCount = Object.values(statusObj).filter(
        (status) => status === "online"
      ).length;
      setOnlinePlayers(onlineCount);
    });
    return () => {
      socket.off("player_status");
    };
  }, []);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room, username);
      socket.on("room_full", (isFull) => {
        if (isFull) {
          alert("Room is full. Please try another room.");
        } else {
          setGoInside(true);
          localStorage.setItem("roomId", room);
        }
      });
    }
  };

  const randomRoomId = () => {
    var minm = 1000;
    var maxm = 9999;
    const demo = Math.floor(Math.random() * (maxm - minm + 1)) + minm;
    setRoom(demo);
  };
  let config = {
    num: [4, 7],
    rps: 0.1,
    radius: [5, 40],
    life: [1.5, 3],
    v: [2, 3],
    tha: [-50, 50],
    alpha: [0.6, 0],
    scale: [0.1, 0.9],
    position: "all",
    cross: "dead",
    random: 10,
  };

  function backbtn() {
    navigate(-1);
  }

  return (
    <>
      <div className="container" >
        <div className="row">
          {!goInside ? (
            <>
              <div className="col-md-6 col-sm-12 d-flex justify-content-center align-items-center hidemobile">
                <img src="image/sideimage.png" className="img-fluid" />
              </div>
              <div
                className="col-md-6 col-sm-12 d-flex justify-content-center align-items-center"
                style={{ height: "100vh" }}
              >
                <div className="joinChatContainer border-0 card shadow p-4">
                  <h3 className="mb-3">Create Game</h3>
                  <hr
                    className="mt-0"
                    style={{ width: "100%", color: "green" }}
                  />
                  <input
                    type="text"
                    placeholder="Your Name"
                    onChange={(event) => {
                      setUsername(event.target.value);
                    }}
                  />
                  <input
                    value={room}
                    type="text"
                    placeholder="Room ID"
                    onChange={(event) => {
                      setRoom(event.target.value);
                    }}
                  />
                  <button onClick={randomRoomId}>Generate Room Id</button>
                  <button onClick={joinRoom}>Join</button>
                  <button
                    className="bg-transparent text-black"
                    onClick={backbtn}
                  >
                    Go Back
                  </button>
                </div>
              </div>
            </>
          ) : (
            <Button socket={socket} username={username} room={room} />
          )}
        </div>

      

        <div>
  <h4>Active Users in the Room:</h4>
  <ul>
    {activeUsers.map((user) => (
      <li key={user}>{user}</li>
    ))}
  </ul>
</div>



      </div>
    </>
  );
}

export default CreateGame;
