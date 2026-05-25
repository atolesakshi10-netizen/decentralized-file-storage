import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ShareFile from "./pages/ShareFile.jsx";
import SharePage from "./pages/SharePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/share/:id" element={<ShareFile />} />
    <Route path="/share/:id" element={<SharePage />} />
    </Routes>
  );
}

export default App;
