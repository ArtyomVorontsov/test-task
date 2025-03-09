import "./App.css";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import TodoTableComponent from "./TodoTable";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/:id" element={<TodoTableComponent />} />
        <Route path="*" element={<Navigate to="/1" />} />
      </Routes>
    </Router>
  );
}

export default App;
