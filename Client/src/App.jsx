import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/login';
import CustomerSignup from './pages/customersignup';
import HomeMainPage from './pages/home';
import EquipmentDescriptionPage from './pages/equipmentdescriptionpage';
import EquipmentCategoriesPage from './pages/equipmentcategories'
import MyBooking from './pages/mybookingspage';
import ContactUs from './pages/contactuspage';


const App = () => {
  return (
    <Router>
      <Routes>  
        <Route path="/" element={<HomeMainPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/customersignup" element={<CustomerSignup />} />
        <Route path="/contactus" element={<ContactUs/>} />
        <Route path="/mybookings" element={<MyBooking />} />
        <Route path="/equipdesc" element={<EquipmentDescriptionPage />} />
        <Route path="/equipcategories" element={<EquipmentCategoriesPage />} />

      </Routes>
    </Router>
  );
};

export default App;
