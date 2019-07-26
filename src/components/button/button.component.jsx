import React from "react";
import "./button.styles.css";

function Button(props) {
  const { onClick, className = "", children } = props;

  return (
    <button onClick={onClick} className={className} type="button">
      {children}
    </button>
  );
}

export default Button;
