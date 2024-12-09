import React from "react";
import { Navbar, Nav, Offcanvas, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
const Home = () => {
  return (
    <>
      {/* Navbar for smaller screens */}
      <Navbar bg="primary" expand="lg" variant="dark" className="d-lg-none">
        <Container>
          <Navbar.Toggle aria-controls="offcanvasNavbar" />
          <Navbar.Brand href="#home">Brand</Navbar.Brand>
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
        <h4>Brand</h4>
        <Nav className="flex-column mt-4">
          <Nav.Link href="home" className="text-white">
            Home
          </Nav.Link>
          <Nav.Link href="student" className="text-white">
            Student
          </Nav.Link>
          <Nav.Link href="pricing" className="text-white">
            Pricing
          </Nav.Link>
          <Nav.Link href="about" className="text-white">
            About
          </Nav.Link>
        </Nav>
      </div>

      {/* Content Area */}
      <div className="p-4" style={{ marginLeft: "250px" }}>
        <h1>this is home page</h1>
      </div>
    </>
  );
};

export default Home;
