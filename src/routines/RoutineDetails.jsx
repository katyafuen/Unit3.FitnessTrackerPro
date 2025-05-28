import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";

export default function RoutineDetails() {
  const { routineId } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [routine, setRoutine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchRoutine();
  }, [routineId]);

  async function handleDelete() {
    if (!window.confirm("Are you sure you want to delete this routine?"))
      return;
    try {
      const res = await fetch(
        `https://fitnesstrac-kr.herokuapp.com/api/routines/${routineId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to delete routine");
      navigate("/routines");
    } catch (e) {
      setError(e.message);
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
      {token && (
        <button onClick={handleDelete} style={{ color: "red" }}>
          Delete Routine
        </button>
      )}
      {error && <output>{error}</output>}
    </div>
  );
}
