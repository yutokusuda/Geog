import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { FixedSizeGrid as Grid } from "react-window";
import "./styles.css"; // CSS ファイルのインポート

const calculateDistance = (x1, y1, x2, y2) => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)).toFixed(2);
};

const GridView = ({ setPin }) => {
  const navigate = useNavigate();
  const handleBack = (event) => {
    event.stopPropagation(); // イベントのバブリングを防ぐ
    navigate("/"); // ホームページに戻る
  };

  const handleShowResult = (event) => {
    event.stopPropagation(); // イベントのバブリングを防ぐ
    navigate("/result"); // 結果ページへナビゲート
  };

  const [scrollOffset, setScrollOffset] = useState({ scrollLeft: 0, scrollTop: 0 });
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(0.1); // 初期スケールを1/100に設定
  const [isDragging, setIsDragging] = useState(false);
  const [startDragPosition, setStartDragPosition] = useState({ x: 0, y: 0 });
  const [referencePoint, setReferencePoint] = useState({ x: 500, y: 400 });
  const [pin, setLocalPin] = useState(null);
  const gridWrapperRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (gridWrapperRef.current) {
        const gridRect = gridWrapperRef.current.getBoundingClientRect();
        const x = event.clientX - gridRect.left;
        const y = event.clientY - gridRect.top;
        setCursorPosition({ x, y });
      } else {
        setCursorPosition({ x: "null", y: "null" });
      }
    };

    const handleMouseDown = (event) => {
      if (gridWrapperRef.current) {
        const gridRect = gridWrapperRef.current.getBoundingClientRect();
        setStartDragPosition({
          x: event.clientX - gridRect.left,
          y: event.clientY - gridRect.top,
        });
        setIsDragging(false);
      }
    };

    const handleMouseUp = (event) => {
      if (event.target.tagName === "BUTTON") return; // ボタンがクリックされた場合は処理を中断する
      if (gridWrapperRef.current) {
        const gridRect = gridWrapperRef.current.getBoundingClientRect();
        const x = event.clientX - gridRect.left;
        const y = event.clientY - gridRect.top;

        if (!isDragging) {
          const adjustedX = (x + scrollOffset.scrollLeft) / scale;
          const adjustedY = (y + scrollOffset.scrollTop) / scale;
          setPin({ x: adjustedX, y: adjustedY });
          setLocalPin({ x: adjustedX, y: adjustedY });
        }
      }
    };

    const handleMouseMoveDrag = (event) => {
      if (gridWrapperRef.current) {
        const gridRect = gridWrapperRef.current.getBoundingClientRect();
        const x = event.clientX - gridRect.left;
        const y = event.clientY - gridRect.top;
        const dragDistance = Math.sqrt(
          Math.pow(x - startDragPosition.x, 2) +
            Math.pow(y - startDragPosition.y, 2)
        );
        if (dragDistance > 5) {
          setIsDragging(true);
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousemove", handleMouseMoveDrag);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousemove", handleMouseMoveDrag);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [scrollOffset, scale, isDragging, startDragPosition, navigate, setPin]);

  return (
    <div className="container">
      {/* ボタンはグリッドの右に配置 */}
      <div className="button-container">
        <button onClick={handleBack} className="btn">Back</button>
        <button onClick={handleShowResult} className="btn">結果</button>
      </div>
      {/* グリッド表示エリア */}
      <div ref={gridWrapperRef} className="grid-container">
        <TransformWrapper
          initialScale={0.1} // 初期スケールを1/100に設定
          options={{
            limitToBounds: false,
            minScale: 0.01, // 最小スケールを1/100に設定
            maxScale: 100, // 最大スケールを設定（100倍）
          }}
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
                width: 50 * 500,
                height: 50 * 100,
                position: "relative",
                zIndex: 1,
              }}
            >
              <Grid
                className="Grid"
                columnCount={50}
                columnWidth={100}
                height={50 * 100}
                rowCount={50}
                rowHeight={100}
                width={50 * 100}
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
                    {/* ここに画像を表示 */}
                    
                  </div>
                )}
              </Grid>
            </div>
          </TransformComponent>
        </TransformWrapper>
        {pin && (
          <div
            className="pin"
            style={{
              position: "absolute",
              left: pin.x * scale - scrollOffset.scrollLeft,
              top: pin.y * scale - scrollOffset.scrollTop,
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
                    referencePoint.x,
                    referencePoint.y
                  )
                : "N/A"}{" "}
              px
            </div>
          </div>
        )}
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
    </div>
  );
};

export default GridView;
