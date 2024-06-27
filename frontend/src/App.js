import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";


function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={ <Navigate to="/Login"/>} />
    
        <Route path="/register" Component={Register}/>
        <Route path="/login" Component={Login}/>
      </Routes>
    </Router>
  );
}

export default App;
