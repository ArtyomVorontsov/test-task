import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TodoTableComponent from "./TodoTable";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/:id" element={<TodoTableComponent />} />
      </Routes>
    </Router>
  );
}

export default App;
