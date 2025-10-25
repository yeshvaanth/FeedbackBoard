import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FeedbackBoard from "./pages/Feedbacks";
import AddFeedback from "./pages/AddFeedback";

function App() {
  const [loggedIn, setLoggedIn] = useState(() => !!localStorage.getItem("token"));

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login onLogin={() => setLoggedIn(true)} />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/board"
          element={loggedIn ? <FeedbackBoard /> : <Navigate to="/login" />}
        />
        <Route
          path="/add-feedback"
          element={loggedIn ? <AddFeedback /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
