import SidebarMenu from "../components/SidebarMenu";
import { Table, Modal, Button } from "react-bootstrap";

import React, { useEffect, useState } from "react";

const Student = () => {
  const [student, setStudent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [courses, setCourses] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [optsid, setOptsId] = useState(null);
  const [studTr, setStudTr] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [message, setMessage] = useState(null);
  const [show, setShow] = useState(false);
  const [showModal2, setShowModal2] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleCloseModal2 = () => setShowModal2(false);
  const handleShowModal2 = () => setShowModal2(true);

  const accessToken = localStorage.getItem("token");
  useEffect(() => {
    const fetchstudent = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/students", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`, // Include the access token here
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch students");
        }
        const data = await response.json();
        setStudent(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchstudent();
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

    const url = editingStudent
      ? `http://127.0.0.1:8000/api/students/${editingStudent.id}`
      : "http://127.0.0.1:8000/api/students";

    const method = editingStudent ? "PUT" : "POST";

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
          `Failed to ${editingStudent ? "update" : "add"} course`
        );
      }

      const updatedStudent = await response.json();
      setMessage(
        `Course ${editingStudent ? "updated" : "added"} successfully!`
      );
      setError(null);

      if (editingStudent) {
        // Update the course in state
        setStudent((prevstudent) =>
          prevstudent.map((student) =>
            student.id === updatedStudent.id ? updatedStudent : student
          )
        );
      } else {
        // Add the new course to state
        setStudent((prevstudent) => [...prevstudent, updatedStudent]);
      }

      // Reset form and close modal
      setFormData({ name: "", email: "", phone: "" });
      setEditingStudent(null);
      handleClose();
    } catch (err) {
      setError(err.message);
      setMessage(null);
    }
  };

  const handleTrainingSchedule = async (id) => {
    setOptsId(id);
    setStudTr([]);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/students/${id}/trainings`,
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
      setStudTr(data);
    } catch (err) {
      setError(err.message);
    }

    handleShowModal2();
  };
  const handleEditClick = (students) => {
    setEditingStudent(students); // Set the selected course
    setFormData({
      name: students.name,
      email: students.email,
      phone: students.phone,
    });
    handleShow(); // Open the modal
  };

  const handleDelete = async (studentId) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/students/${studentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete Student");
      }

      setStudent((prevstudent) =>
        prevstudent.filter((course) => course.id !== studentId)
      );

      setMessage("Student deleted successfully!");
      setError(null);
    } catch (err) {
      setError(err.message);
      setMessage(null);
    }
  };

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
      } catch (err) {
        setError(err.message);
      }
    };

    fetchSchedules();
  }, []);

  const courseLookup = courses.reduce((acc, course) => {
    acc[course.id] = course.name;
    return acc;
  }, {});

  const handleOptStatus = async (sdId, tsId, currentStatus) => {
    const trainingIndex = studTr.findIndex((opt) => opt.schedule_id === tsId);
    const newStatus = currentStatus === "opt-in" ? "opt-out" : "opt-in";

    try {
      // Update the backend
      const response = await fetch(
        `http://127.0.0.1:8000/api/trainings/opt-in-out`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            student_id: sdId,
            schedule_id: tsId,
            status: newStatus,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update opt-in/out status");
      }

      // Update the local state to reflect the new status
      // setStudTr((prevStudTr) =>
      //   prevStudTr.map((opt, index) =>
      //     index === trainingIndex ? { ...opt, status: newStatus } : opt
      //   )
      // );
      handleTrainingSchedule(sdId);
    } catch (err) {
      setError(err.message);
    }
  };

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
          <h2>Student</h2>

          <Button
            variant="primary"
            style={{ float: "right", marginBottom: "20px" }}
            onClick={handleShow}
          >
            Add Student
          </Button>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>SL.</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Training</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {student.map((row, ind) => (
                <tr key={row.id}>
                  <td>{ind + 1}</td>
                  <td>{row.name}</td>
                  <td>{row.phone}</td>
                  <td>{row.email}</td>
                  <td>
                    <span
                      className="text-primary"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleTrainingSchedule(row.id)}
                    >
                      OptIn / OptOut
                    </span>
                  </td>

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
              ))}
            </tbody>
          </Table>
          <div>
            {/* Button to Trigger Modal */}

            {/* Modal-1 */}
            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Modal Title</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="phone" className="form-label">
                      Phone
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="phone"
                      name="phone"
                      value={formData.phone}
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

            {/* Modal-2 */}
            <Modal show={showModal2} onHide={handleCloseModal2}>
              <Modal.Header closeButton>
                <Modal.Title>Student Training Schedule: {optsid}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Course</th>
                      <th>Start</th>
                      <th>end</th>
                      <th>opt in/out</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schedule.map((row) => {
                      const courseName = courseLookup[row.course_id];
                      const currentStatus =
                        studTr.find((opt) => opt.schedule_id === row.id)
                          ?.status || "opt-out";
                      return (
                        <tr key={row.id}>
                          <td>{courseName}</td>
                          <td>{row.start_date}</td>
                          <td>{row.end_date}</td>
                          <td>
                            <span
                              className="text-primary"
                              style={{ cursor: "pointer" }}
                              onClick={() =>
                                handleOptStatus(optsid, row.id, currentStatus)
                              }
                            >
                              {currentStatus}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </Modal.Body>
              <Modal.Footer></Modal.Footer>
            </Modal>
          </div>
        </div>
      </div>
    </>
  );
};

export default Student;
