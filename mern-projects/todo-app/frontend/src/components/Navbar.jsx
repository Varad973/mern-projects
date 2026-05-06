import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        ✓ To-Do List
      </Link>
      <Link to="/add" className="nav-link">
        + Add To Do
      </Link>
    </nav>
  );
}

export default Navbar;
