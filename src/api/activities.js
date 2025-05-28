export async function fetchActivity(activityId) {
  const response = await fetch(
    `https://fitnesstrac-kr.herokuapp.com/api/activities/${activityId}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch activity");
  }
  return response.json();
}
