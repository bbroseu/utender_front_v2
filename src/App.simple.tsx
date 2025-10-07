import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UtenderHomePage } from "./screens/UtenderHomePage/UtenderHomePage";

export const AppSimple = (): JSX.Element => {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Routes>
          <Route path="/" element={<UtenderHomePage />} />
          <Route path="/test" element={<div className="p-8">Test Route Working!</div>} />
        </Routes>
      </div>
    </Router>
  );
};