import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Games from "./Games";
import JoinGame from "./JoinGame";
import CreateGame from "./CreateGame";

function App() {
  return (
    <>
      <div className="App " style={{ height:'100vh' ,overflow: "hidden" }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Games />} />
            <Route path="/CreateGame" element={<CreateGame />} />
            <Route path="/JoinGame" element={<JoinGame/>} />

          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
