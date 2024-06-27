import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Register from "./components/Register/Register";


function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={ <Navigate to="/Register"/>} />
    
        <Route path="/register" Component={Register}/>
      </Routes>
    </Router>
  );
}

export default App;
