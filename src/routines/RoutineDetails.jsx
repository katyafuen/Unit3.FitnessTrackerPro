import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";

export default function RoutineDetails() {
  const { routineId } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [routine, setRoutine] = useState(null);
  const [activities, setActivities] = useState([]);
  const [sets, setSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [setsLoading, setSetsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [setErrorMsg, setSetErrorMsg] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState("");
  const [reps, setReps] = useState("");

  // Fetch routine details
  useEffect(() => {
    async function fetchRoutine() {
      setLoading(true);
      try {
        const res = await fetch(
          `https://fitnesstrac-kr.herokuapp.com/api/routines/${routineId}`
        );
        if (!res.ok) throw new Error("Failed to fetch routine");
        const data = await res.json();
        setRoutine(data);
        setSets(data.activities || []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
        setSetsLoading(false);
      }
    }
    fetchRoutine();
  }, [routineId]);

  // Fetch activities for dropdown
  useEffect(() => {
    async function fetchActivities() {
      try {
        const res = await fetch(
          "https://fitnesstrac-kr.herokuapp.com/api/activities"
        );
        if (!res.ok) throw new Error("Failed to fetch activities");
        const data = await res.json();
        setActivities(data);
      } catch (e) {
        // Optionally handle error
      }
    }
    fetchActivities();
  }, []);

  // Add set to routine
  async function handleAddSet(e) {
    e.preventDefault();
    setSetErrorMsg(null);
    try {
      const res = await fetch(
        `https://fitnesstrac-kr.herokuapp.com/api/routines/${routineId}/activities`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            activityId: selectedActivity,
            count: reps,
            duration: 1, // You can add a duration field if needed
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add set");
      setSelectedActivity("");
      setReps("");
      // Refresh sets
      setSetsLoading(true);
      const routineRes = await fetch(
        `https://fitnesstrac-kr.herokuapp.com/api/routines/${routineId}`
      );
      const routineData = await routineRes.json();
      setSets(routineData.activities || []);
      setSetsLoading(false);
    } catch (e) {
      setSetErrorMsg(e.message);
    }
  }

  // Delete set from routine
  async function handleDeleteSet(routineActivityId) {
    try {
      const res = await fetch(
        `https://fitnesstrac-kr.herokuapp.com/api/routine_activities/${routineActivityId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to delete set");
      // Refresh sets
      setSetsLoading(true);
      const routineRes = await fetch(
        `https://fitnesstrac-kr.herokuapp.com/api/routines/${routineId}`
      );
      const routineData = await routineRes.json();
      setSets(routineData.activities || []);
      setSetsLoading(false);
    } catch (e) {
      setSetErrorMsg(e.message);
    }
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!routine) return <p>Routine not found.</p>;

  return (
    <div>
      <h1>{routine.name}</h1>
      <p>
        <strong>Creator:</strong> {routine.creatorName}
      </p>
      <p>
        <strong>Goal:</strong> {routine.goal}
      </p>

      <h2>Sets</h2>
      {setsLoading ? (
        <p>Loading sets...</p>
      ) : sets.length === 0 ? (
        <p>No sets yet. {token && "Add a set to get started!"}</p>
      ) : (
        <ul>
          {sets.map((set) => (
            <li key={set.routineActivityId || set.id}>
              {set.name} - {set.count} reps
              {token && (
                <button
                  style={{ marginLeft: "1em", color: "red" }}
                  onClick={() =>
                    handleDeleteSet(set.routineActivityId || set.id)
                  }
                >
                  Delete
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {token && (
        <form onSubmit={handleAddSet}>
          <h3>Add a Set</h3>
          <label>
            Activity:
            <select
              value={selectedActivity}
              onChange={(e) => setSelectedActivity(e.target.value)}
              required
            >
              <option value="">Select an activity</option>
              {activities.map((activity) => (
                <option key={activity.id} value={activity.id}>
                  {activity.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Reps:
            <input
              type="number"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              min="1"
              required
            />
          </label>
          <button type="submit">Add Set</button>
          {setErrorMsg && <output>{setErrorMsg}</output>}
        </form>
      )}
    </div>
  );
}
