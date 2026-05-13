import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ChatPortfolio from "./pages/ChatPortfolio.jsx";
import EditorialPortfolio from "./pages/EditorialPortfolio.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ChatPortfolio />} />
      <Route path="/editorial" element={<EditorialPortfolio />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
