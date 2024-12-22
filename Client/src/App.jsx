import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/login';
import CustomerSignup from './pages/customersignup';
import CustomerNavbar from './components/customernavbar';


const App = () => {
  return (
    <Router>
      <CustomerNavbar />
      <Routes>  
        <Route path="/" />
        <Route path="/login" element={<Login />} />
        <Route path="/customersignup" element={<CustomerSignup />} />
      </Routes>
    </Router>
  );
};

export default App;
