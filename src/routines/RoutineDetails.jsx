import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function RoutineDetails() {
  const { routineId } = useParams();
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
      {/* Add more details as needed */}
    </div>
  );
}
