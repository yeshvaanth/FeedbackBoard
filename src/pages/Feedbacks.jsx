import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import '../styles/feedbackboard.css';

function FeedbackBoard() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchFeedbacks = async (status = "") => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://feedbackboard-backend.onrender.com/feedbacks${status ? `?status=${status}` : ""}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFeedbacks(res.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load feedbacks");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);


  const handleVote = async (id) => {
    try {
      const res = await axios.post(
        `http://localhost:8080/feedbacks/${id}/vote`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFeedbacks((prev) =>
        prev.map((fb) => (fb._id === id ? res.data : fb))
      );
    } catch (err) {
      setError(err.response?.data?.message || "Vote failed");
    }
  };


  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await axios.put(
        `https://feedbackboard-backend.onrender.com/feedbacks/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFeedbacks((prev) =>
        prev.map((fb) => (fb._id === id ? res.data : fb))
      );
    } catch (err) {
      setError("Failed to update status");
    }
  };


  const handleFilterChange = (e) => {
    const status = e.target.value;
    setFilterStatus(status);
    fetchFeedbacks(status);
  };

  if (loading) return <p>Loading feedbacks...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="feedback-container">
  <div className="feedback-header">
    <button onClick={() => navigate("/add-feedback")}>Add Feedback</button>
    <label>
      Filter by status:
      <select value={filterStatus} onChange={handleFilterChange}>
        <option value="">All</option>
        <option value="Planned">Planned</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
        <option value="Rejected">Rejected</option>
      </select>
    </label>
  </div>

  {feedbacks.length === 0 ? (
    <p className="feedback-message">No feedbacks yet</p>
  ) : (
    feedbacks.map((fb) => (
      <div key={fb._id} className="feedback-card">
        <h3>{fb.title}</h3>
        <p>{fb.description}</p>
        <p>
          Status: 
          <select value={fb.status} onChange={(e) => handleStatusChange(fb._id, e.target.value)}>
            <option value="Planned">Planned</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Rejected">Rejected</option>
          </select> 
          | Votes: <strong>{fb.votes_count}</strong>
        </p>
        <button onClick={() => handleVote(fb._id)}>Upvote</button>
      </div>
    ))
  )}
</div>
  );
}

export default FeedbackBoard;
