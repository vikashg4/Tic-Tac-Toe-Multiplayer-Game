import React from 'react'
import {useNavigate } from 'react-router-dom'
 
export default function CreateGame() {
 const navigate = useNavigate()
 
 

 return (
 <div>
 <div className="container" >
 {/* <ParticlesBg type="lines" config={config} bg={true} num={100} /> */}

 <div className="row" >
 
 <>
 <div className="col-md-6 col-sm-12 d-flex justify-content-center align-items-center hidemobile">
 <img src="image/sideimage.png" className="img-fluid" />
 </div>
 <div className="col-md-6 col-sm-12 d-flex justify-content-center align-items-center">
 <div className="joinChatContainer border-0 card shadow p-4">
 <h3 className="mb-3">Multiplayer Game</h3>
 <hr
 className="mt-0"
 style={{ width: "100%", color: "green" }}
 />
 <button onClick={()=>navigate("/CreateGame")}>Create Game</button> 

 <button onClick={()=>navigate("/JoinGame")}>Join Game</button>
 </div>
 </div>
 </>
 
 </div>
 </div>
 </div>
 )
}