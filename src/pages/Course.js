import SidebarMenu from "../components/SidebarMenu";
import { Table, Modal, Button } from "react-bootstrap";

import React, { useEffect, useState } from "react";

const Course = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    duration: "",
    description: "",
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
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
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

    const url = editingCourse
      ? `http://127.0.0.1:8000/api/courses/${editingCourse.id}`
      : "http://127.0.0.1:8000/api/courses";

    const method = editingCourse ? "PUT" : "POST";

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
        throw new Error(`Failed to ${editingCourse ? "update" : "add"} course`);
      }

      const updatedCourse = await response.json();
      setMessage(`Course ${editingCourse ? "updated" : "added"} successfully!`);
      setError(null);

      if (editingCourse) {
        // Update the course in state
        setCourses((prevCourses) =>
          prevCourses.map((course) =>
            course.id === updatedCourse.id ? updatedCourse : course
          )
        );
      } else {
        // Add the new course to state
        setCourses((prevCourses) => [...prevCourses, updatedCourse]);
      }

      // Reset form and close modal
      setFormData({ name: "", duration: "", description: "" });
      setEditingCourse(null);
      handleClose();
    } catch (err) {
      setError(err.message);
      setMessage(null);
    }
  };

  const handleEditClick = (course) => {
    setEditingCourse(course); // Set the selected course
    setFormData({
      name: course.name,
      duration: course.duration,
      description: course.description,
    });
    handleShow(); // Open the modal
  };

  const handleDelete = async (courseId) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/courses/${courseId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete course");
      }

      setCourses((prevCourses) =>
        prevCourses.filter((course) => course.id !== courseId)
      );

      setMessage("Course deleted successfully!");
      setError(null);
    } catch (err) {
      setError(err.message);
      setMessage(null);
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
          <h2>Course</h2>

          <Button
            variant="primary"
            style={{ float: "right", marginBottom: "20px" }}
            onClick={handleShow}
          >
            Add new course
          </Button>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>SL.</th>
                <th>Name</th>
                <th>Duration</th>
                <th>Description</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((row, ind) => (
                <tr key={row.id}>
                  <td>{ind + 1}</td>
                  <td>{row.name}</td>
                  <td>{row.duration}</td>
                  <td>{row.description}</td>
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
                    <label htmlFor="duration" className="form-label">
                      Duration
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="duration"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                      Description
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="description"
                      name="description"
                      value={formData.description}
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

export default Course;
