import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchActivity } from "../api/activities";
import { useAuth } from "../auth/AuthContext";

export default function ActivityDetails() {
  const { activityId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const {
    data: activity,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["activity", activityId],
    queryFn: () => fetchActivity(activityId),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading activity</div>;
  if (!activity) return <div>Activity not found</div>;

  const handleDelete = async () => {
    try {
      await fetch(`/api/activities/${activityId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      navigate("/");
    } catch (error) {
      console.error("Error deleting activity:", error);
    }
  };

  return (
    <div className="activity-details">
      <h2>{activity.name}</h2>
      <p>{activity.description}</p>
      <p>Created by: {activity.creatorName}</p>
      {token && activity.isPublic && (
        <button onClick={handleDelete}>Delete Activity</button>
      )}
    </div>
  );
}
