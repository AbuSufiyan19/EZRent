import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/login';
import CustomerSignup from './pages/customersignup';
import HomeMainPage from './pages/home';


const App = () => {
  return (
    <Router>
      <Routes>  
        <Route path="/" element={<HomeMainPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/customersignup" element={<CustomerSignup />} />
      </Routes>
    </Router>
  );
};

export default App;
