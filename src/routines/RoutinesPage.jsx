import { Link } from "react-router-dom";
import useQuery from "../api/useQuery";

export default function RoutinesPage() {
  const { data: routines, loading, error } = useQuery("/routines", "routines");

  if (loading) return <h1>Loading...</h1>;
  if (error) return <h1>Error: {error}</h1>;
  if (!routines) return <h1>No routines found.</h1>;

  return (
    <div>
      <h1>Routines</h1>
      <ul>
        {routines.map((routine) => (
          <li key={routine.id}>
            <Link to={`/routines/${routine.id}`}>{routine.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
