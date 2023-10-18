// eslint-disable-next-line
import React from "react";

const Blocks = (props) => {
  return (
    <div
      className="Boxes shadow-lg p-1  p-md-2 p-lg-2"
      onClick={props.onClick}
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "#0093e8",
        backgroundColor: "#fff",
        cursor: "pointer",
        borderRadius: "10px",
      }}
    >
      {props.value === "X" ? (
        <img
          src="image/x-mark.png"
          alt=""
          style={{
            width: "100%",
            objectFit: "contain",
            // padding: "20px",
            height: "100%",
          }}
        />
      ) : props.value === "O" ? (
        <img
          src="image/donuts.png"
          alt=""
          style={{
            width: "100%",
            objectFit: "contain",

            height: "100%",
          }}
        />
      ) : null}
    </div>
  );
};
export default Blocks;
