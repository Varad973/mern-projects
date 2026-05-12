import { useState, useEffect } from "react";
import axios from "axios";
import EventCard from "../components/EventCard";

const API_URL = import.meta.env.VITE_API_URL || "/api";

function HomePage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/events`);
      setEvents(res.data.data || []);
      setError(null);
    } catch (err) {
      setError("Failed to fetch events. Ensure the server is running.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading upcoming events...</div>;

  return (
    <div>
      <div className="page-header">
        <h1>Upcoming Events</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      {events.length === 0 && !error ? (
        <div className="empty-message">
          <h2>No events found</h2>
          <p>Check back later or create a new event to get started.</p>
        </div>
      ) : (
        <div className="events-grid">
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}

export default HomePage;
