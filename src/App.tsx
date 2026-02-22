import { Navigate, Route, Routes } from "react-router-dom";

import Curl2Ffmpeg from "./pages/Curl2Ffmpeg";
import DeepResearchCleaner from "./pages/DeepResearchCleaner";
import Home from "./pages/Home";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/tools/curl2ffmpeg" element={<Curl2Ffmpeg />} />
      <Route path="/tools/deep-research-cleaner" element={<DeepResearchCleaner />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;