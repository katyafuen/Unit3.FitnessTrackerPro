import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Layout from "./layout/Layout";
import Register from "./auth/Register";
import Login from "./auth/Login";
import ActivitiesPage from "./activities/ActivitiesPage";
import Error404 from "./Error404.jsx";
import ActivityDetails from "./activities/ActivityDetails";
import RoutineDetails from "./routines/RoutineDetails.jsx";
import RoutinesPage from "./routines/RoutinesPage.jsx";

/**
 * Fitness Trackr is a platform where fitness enthusiasts can share their workouts and
 * discover new routines. Anyone can browse the site and make an account, and users with an
 * account will be able to upload and manage their own activities.
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<ActivitiesPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/activities/:activityId" element={<ActivityDetails />} />
          <Route path="/routines" element={<RoutinesPage />} />
          <Route path="/routines/:routineId" element={<RoutineDetails />} />
          <Route path="*" element={<Error404 />} />
        </Route>
      </Routes>
      <Link to="/routines">Routines</Link>
    </BrowserRouter>
  );
}
