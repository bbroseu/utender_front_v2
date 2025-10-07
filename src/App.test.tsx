import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

export const AppTest = (): JSX.Element => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <div className="p-8">
          <h1 className="text-2xl font-bold text-red-500">Test App Working!</h1>
          <p className="text-gray-600">If you see this, the basic React app is working.</p>
        </div>
        <Routes>
          <Route path="/" element={<div className="p-4">Home Page</div>} />
          <Route path="/test" element={<div className="p-4">Test Page</div>} />
        </Routes>
      </div>
    </Router>
  );
};