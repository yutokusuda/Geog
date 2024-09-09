import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import GridView from "./GridView";
import HomePage from "./HomePage";
import ResultPage from "./ResultPage";
import "./styles.css"; // CSS ファイルのインポート



const App = () => {
  const [pin, setPin] = useState(null);
  const [constantCoordinates] = useState({ x: 1000, y: 1000 }); // 定数座標

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/grid"
            element={<GridView setPin={setPin} />}  />
        <Route path="/result"  element={<ResultPage pin={pin} constantCoordinates={constantCoordinates} />} />
      </Routes>
    </Router>
  );
};

export default App;
