import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Student from "./pages/Student";
import Course from "./pages/Course";
import TrainingSchedule from "./pages/TrainingSchadule";
import Login from "./pages/Login";
import ProtectedRoute from "./auth/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Student />
            </ProtectedRoute>
          }
        />
        <Route
          path="/course"
          element={
            <ProtectedRoute>
              <Course />
            </ProtectedRoute>
          }
        />
        <Route
          path="/training-schedule"
          element={
            <ProtectedRoute>
              <TrainingSchedule />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
