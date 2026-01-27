import { Navigate, Route, Routes } from "react-router-dom";

import Curl2Ffmpeg from "./pages/Curl2Ffmpeg";
import Home from "./pages/Home";
import Tarot from "./pages/Tarot";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/tools/curl2ffmpeg" element={<Curl2Ffmpeg />} />
      <Route path="/tools/tarot" element={<Tarot />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;