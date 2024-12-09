import React from "react";
import { Link } from "react-router-dom";

import { Navbar, Nav, Offcanvas, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const SidebarMenu = () => {
  return (
    <>
      {/* Navbar for smaller screens */}
      <Navbar bg="primary" expand="lg" variant="dark" className="d-lg-none">
        <Container>
          <Navbar.Toggle aria-controls="offcanvasNavbar" />
          <Navbar.Brand href="#home">Student training </Navbar.Brand>
          <Navbar.Offcanvas
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
            placement="start"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id="offcanvasNavbarLabel">Menu</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="flex-column">
                <Nav.Link href="#home">Home</Nav.Link>
                <Nav.Link href="#features">Features</Nav.Link>
                <Nav.Link href="#pricing">Pricing</Nav.Link>
                <Nav.Link href="#about">About</Nav.Link>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>

      {/* Sidebar for larger screens */}
      <div
        className="d-none d-lg-block bg-primary text-white vh-100 p-3"
        style={{ width: "250px", position: "fixed" }}
      >
        <h4>Student training</h4>
        <Nav className="flex-column mt-4">
          <Link to="/" className="text-white">
            Student
          </Link>
          <Link to="/course" className="text-white">
            Course
          </Link>
          <Link to="/training-schedule" className="text-white">
            Training Schedule
          </Link>
        </Nav>
      </div>
    </>
  );
};

export default SidebarMenu;
