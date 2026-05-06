import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import AddTask from "./pages/AddTask";
import EditTask from "./pages/EditTask";
import TaskDetails from "./pages/TaskDetails";
import "./App.css";

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/add" element={<AddTask />} />
          <Route path="/edit/:id" element={<EditTask />} />
          <Route path="/task/:id" element={<TaskDetails />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
