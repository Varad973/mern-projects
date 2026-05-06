import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        🎓 Student Management
      </Link>
      <Link to="/add" className="nav-link">
        + Add Student
      </Link>
    </nav>
  );
}

export default Navbar;
