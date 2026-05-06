import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import AddStudent from "./pages/AddStudent";
import EditStudent from "./pages/EditStudent";
import StudentDetails from "./pages/StudentDetails";
import "./App.css";

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/add" element={<AddStudent />} />
          <Route path="/edit/:id" element={<EditStudent />} />
          <Route path="/student/:id" element={<StudentDetails />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
