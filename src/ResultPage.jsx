import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { FixedSizeGrid as Grid } from "react-window";
import "./styles.css"; // CSS ファイルのインポート

const calculateDistance = (x1, y1, x2, y2) => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)).toFixed(2);
};

const ResultPage = ({ pin }) => {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate("/"); // ホームページに戻る
  };

  const [scrollOffset, setScrollOffset] = useState({ scrollLeft: 0, scrollTop: 0 });
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const gridWrapperRef = useRef(null);

  // 定数の answerPin 座標
  const answerPin = { x: 100, y: 100 }; // ここで座標を設定

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (gridWrapperRef.current) {
        const gridRect = gridWrapperRef.current.getBoundingClientRect();
        const x = event.clientX - gridRect.left;
        const y = event.clientY - gridRect.top;
        setCursorPosition({ x, y });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="container">
      <button
        onClick={handleBack}
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          zIndex: 1000,
          backgroundColor: "#28A745",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          padding: "10px 20px",
          cursor: "pointer",
        }}
      >
        Back
      </button>

      <div ref={gridWrapperRef} className="grid-container">
        <TransformWrapper
          options={{ limitToBounds: false, initialScale: 1 }} // 初期倍率を設定
          onZoomStop={({ state }) => setScale(state.scale)}
          onPanningStop={({ state }) => {
            setScrollOffset({
              scrollLeft: -state.positionX,
              scrollTop: -state.positionY,
            });
          }}
        >
          <TransformComponent>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: 500,
                height: 500,
                position: "relative",
              }}
            >
              <Grid
                className="Grid"
                columnCount={80}
                columnWidth={10}
                height={500}
                rowCount={80}
                rowHeight={10}
                width={500}
                style={{ overflow: "hidden", position: "absolute" }}
              >
                {({ columnIndex, rowIndex, style }) => (
                  <div
                    style={{
                      ...style,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor:
                        (columnIndex + rowIndex) % 2 === 0
                          ? "#f8f8f0"
                          : "#ffffff",
                    }}
                  >
                    
                  </div>
                )}
              </Grid>
            </div>
          </TransformComponent>
        </TransformWrapper>

        {/* SVG要素でピンを結ぶ線を追加 */}
        <svg
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            pointerEvents: "none", // マウスイベントを無効にする
            top: 0,
            left: 0,
          }}
        >
          {pin && (
            <line
              x1={(pin.x * scale - scrollOffset.scrollLeft)*(1/10)}
              y1={(pin.y * scale - scrollOffset.scrollTop)*(1/10)}
              x2={answerPin.x * scale - scrollOffset.scrollLeft}
              y2={answerPin.y * scale - scrollOffset.scrollTop}
              stroke="red"
              strokeWidth="2"
            />
          )}
        </svg>

        {pin && (
          <div
            className="pin"
            style={{
              position: "absolute",
              left: (pin.x * scale - scrollOffset.scrollLeft)*(1/10),
              top: (pin.y * scale - scrollOffset.scrollTop)*(1/10),
              backgroundColor: "red",
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                position: "absolute",
                bottom: "100%",
                left: "50%",
                transform: "translateX(-50%)",
                backgroundColor: "white",
                padding: "2px 5px",
                borderRadius: "3px",
                fontSize: "12px",
                boxShadow: "0 0 2px rgba(0,0,0,0.3)",
              }}
            >
              Distance:{" "}
              {pin
                ? calculateDistance(
                    pin.x,
                    pin.y,
                    answerPin.x,
                    answerPin.y
                  )
                : "N/A"}{" "}
              px
            </div>
          </div>
        )}

        {/* 新しい answerPin の表示 */}
        <div
          className="answer-pin"
          style={{
            position: "absolute",
            left: answerPin.x * scale - scrollOffset.scrollLeft,
            top: answerPin.y * scale - scrollOffset.scrollTop,
            backgroundColor: "blue",
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              position: "absolute",
              bottom: "100%",
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "white",
              padding: "2px 5px",
              borderRadius: "3px",
              fontSize: "12px",
              boxShadow: "0 0 2px rgba(0,0,0,0.3)",
            }}
          >
            Answer Pin
          </div>
        </div>

        <div
          className="cursor-position"
          style={{
            position: "absolute",
            left: cursorPosition.x * scale - scrollOffset.scrollLeft,
            top: cursorPosition.y * scale - scrollOffset.scrollTop,
            backgroundColor: "lightyellow",
            padding: "2px 5px",
            borderRadius: "3px",
            fontSize: "12px",
            boxShadow: "0 0 2px rgba(0,0,0,0.3)",
            pointerEvents: "none",
          }}
        >
          Cursor Position: X: {cursorPosition.x.toFixed(2)} px, Y:{" "}
          {cursorPosition.y.toFixed(2)} px
        </div>
      </div>
      {pin ? (
        <div>
          <p>Pin Position:</p>
          <p>X: {pin.x.toFixed(2)}</p>
          <p>Y: {pin.y.toFixed(2)}</p>
        </div>
      ) : (
        <p>No pin set</p>
      )}
    </div>
  );
};

export default ResultPage;
