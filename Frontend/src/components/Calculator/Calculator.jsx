import { useState, useEffect } from "react";
import "./Calculator.css";

const Calculator = () => {
  const [show, setShow] = useState(false);
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.altKey && e.key.toLowerCase() === "c") {
        e.preventDefault();
        setShow((prev) => !prev);
      }
      if (e.key === "Escape") {
        setShow(false);
      }
      if (!show) return; // Stop processing if modal is closed

      if (/[\d+\-*/.=]/.test(e.key)) {
        e.preventDefault();
        handleButtonClick(e.key);
      }
      if (e.key === "Enter") {
        e.preventDefault();
        handleButtonClick("=");
      }
      if (e.key === "Backspace") {
        e.preventDefault();
        setInput((prev) => prev.slice(0, -1));
      }
      if (e.key.toLowerCase() === "c") {
        handleButtonClick("C");
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [show, input]);

  const handleButtonClick = (value) => {
    if (value === "=" || value === "Enter") {
      try {
        setResult(eval(input).toString()); // Evaluate the expression
      } catch {
        setResult("Error");
      }
    } else if (value === "C") {
      setInput("");
      setResult("");
    } else {
      setInput((prev) => prev + value);
    }
  };

  return (
    <>
      {show && (
        <div className="modal-overlay calculator-modal-overlay">
          <div className="modal-content calculator-modal-content">
            <span className="modal-close" onClick={() => setShow(false)}>
              &times;
            </span>
            <h3 className="modal-title calculator-modal-title">Calculator</h3>

            {/* Display Area */}
            <div className="calculator-display">
              <input
                type="text"
                value={input}
                readOnly
                className="calculator-input"
              />
              <div className="calculator-result">= {result}</div>
            </div>

            {/* Calculator Buttons */}
            <div className="calculator-grid">
              {[
                "7",
                "8",
                "9",
                "/",
                "4",
                "5",
                "6",
                "*",
                "1",
                "2",
                "3",
                "-",
                "C",
                "0",
                "=",
                "+",
              ].map((btn) => (
                <button
                  key={btn}
                  className="calculator-btn"
                  onClick={() => handleButtonClick(btn)}
                >
                  {btn}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Calculator;
