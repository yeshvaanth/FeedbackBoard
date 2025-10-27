import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddFeedback() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) {
      setError("Please enter both title and description");
      return;
    }

    try {
      await axios.post(
        "https://feedbackboard-backend.onrender.com/feedbacks",
        { title, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );


      navigate("/board");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add feedback");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "20px auto" }}>
      <h2>Add New Feedback</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
        <button type="submit" style={{ marginRight: "10px" }}>Add Feedback</button>
        <button type="button" onClick={() => navigate("/board")}>Cancel</button>
      </form>
    </div>
  );
}

export default AddFeedback;
