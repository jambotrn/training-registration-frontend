import SidebarMenu from "../components/SidebarMenu";
import { Table, Modal, Button } from "react-bootstrap";

import React, { useEffect, useState } from "react";

const TrainingSchedule = () => {
  const [courses, setCourses] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingSchedule, setEditingSchedule] = useState(null);

  const [formData, setFormData] = useState({
    course_id: "",
    start_date: "",
    end_date: "",
  });
  const [message, setMessage] = useState(null);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const accessToken = localStorage.getItem("token");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/courses", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`, // Include the access token here
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }
        const data = await response.json();
        setCourses(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/training-schedules",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`, // Include the access token here
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch Schedule");
        }
        const data = await response.json();
        setSchedule(data);
        console.log(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = editingSchedule
      ? `http://127.0.0.1:8000/api/training-schedules/${editingSchedule.id}`
      : "http://127.0.0.1:8000/api/training-schedules";

    const method = editingSchedule ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to ${editingSchedule ? "update" : "add"} Schedule`
        );
      }

      const updatedSchedule = await response.json();
      setMessage(
        `Schedule ${editingSchedule ? "updated" : "added"} successfully!`
      );
      setError(null);

      if (editingSchedule) {
        // Update the course in state
        setSchedule((prev) =>
          prev.map((course) =>
            course.id === updatedSchedule.id ? updatedSchedule : course
          )
        );
      } else {
        // Add the new course to state
        setSchedule((prev) => [...prev, updatedSchedule]);
      }

      // Reset form and close modal
      setFormData({ course_id: "", start_date: "", end_date: "" });
      setEditingSchedule(null);
      handleClose();
    } catch (err) {
      setError(err.message);
      setMessage(null);
    }
  };

  const handleEditClick = (schedules) => {
    setEditingSchedule(schedules);
    setFormData({
      course_id: schedules.course_id,
      start_date: schedules.start_date,
      end_date: schedules.end_date,
    });
    handleShow(); // Open the modal
  };

  const handleDelete = async (schedulesId) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/training-schedules/${schedulesId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete schedules");
      }

      setSchedule((setSchedule) =>
        setSchedule.filter((schedules) => schedules.id !== schedulesId)
      );

      setMessage("Schedule deleted successfully!");
      setError(null);
    } catch (err) {
      setError(err.message);
      setMessage(null);
    }
  };

  const courseLookup = courses.reduce((acc, course) => {
    acc[course.id] = course.name;
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="center-loading">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <SidebarMenu />
      <div className="p-4" style={{ marginLeft: "250px" }}>
        <div className="container mt-5">
          <h2>Training Schedule</h2>

          <Button
            variant="primary"
            style={{ float: "right", marginBottom: "20px" }}
            onClick={handleShow}
          >
            Add new Schedule
          </Button>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>SL.</th>
                <th>Course</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((row, ind) => {
                const courseName = courseLookup[row.course_id] || "N/A";
                return (
                  <tr key={row.id}>
                    <td>{ind + 1}</td>
                    <td>{courseName}</td>
                    <td>{row.start_date}</td>
                    <td>{row.end_date}</td>
                    <td>
                      <span
                        className="text-primary"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleEditClick(row)}
                      >
                        Edit
                      </span>{" "}
                      &nbsp;{" "}
                      <span
                        className="text-danger"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleDelete(row.id)}
                      >
                        Delete
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          <div>
            {/* Button to Trigger Modal */}

            {/* Modal */}
            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Modal Title</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      Course Name
                    </label>
                    <select
                      id="course_id"
                      name="course_id"
                      className="form-control"
                      value={formData.course_id}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Course</option>
                      {courses.map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="start_date" className="form-label">
                      Start Date
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="start_date"
                      name="start_date"
                      value={formData.start_date}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="end_date" className="form-label">
                      End Date
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="end_date"
                      name="end_date"
                      value={formData.end_date}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    submit
                  </button>
                </form>
              </Modal.Body>
              <Modal.Footer></Modal.Footer>
            </Modal>
          </div>
        </div>
      </div>
    </>
  );
};

export default TrainingSchedule;
