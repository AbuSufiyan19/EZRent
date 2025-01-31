import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/login';
import CustomerSignup from './pages/customersignup';
import HomeMainPage from './pages/home';
import EquipmentDescriptionPage from './pages/equipmentdescriptionpage';
import EquipmentCategoriesPage from './pages/equipmentcategories'
import MyBooking from './pages/mybookingspage';
import ContactUs from './pages/contactuspage';
import EmailVerificationSuccess from './pages/emailverificationsuccess'
import EmailVerificationFailure from './pages/emailverificationfailure'
import HomeRent from './pages/renterPages/homerenter';
import HomeAdmin from './pages/adminPages/homeadmin'; 
import AccountUploadIdProof from './pages/renterauthPages/accountuploadidproof';
import AccountReUploadIdProof from './pages/renterauthPages/accountreuploadidproof';
import AccountPendingVerification from './pages/renterauthPages/accountpendingverification';
import AccountBlocked from './pages/renterauthPages/renteraccountblockedPage';


const App = () => {
  return (
    <Router>
      <Routes>  
        <Route path="/" element={<HomeMainPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/customersignup" element={<CustomerSignup />} />
        <Route path="/contactus" element={<ContactUs/>} />
        <Route path="/email-verification-success" element={<EmailVerificationSuccess />} />
        <Route path="/email-verification-failure" element={<EmailVerificationFailure />} />
        <Route path="/mybookings" element={<MyBooking />} />
        <Route path="/equipdesc" element={<EquipmentDescriptionPage />} />
        <Route path="/equipcategories" element={<EquipmentCategoriesPage />} />

        <Route path="/renterhome" element={<HomeRent />} />
        <Route path="/adminhome" element={<HomeAdmin />} />
        <Route path="/account-uploadIdproof" element={<AccountUploadIdProof />} /> 
        <Route path="/account-pendingverification" element={<AccountPendingVerification />} /> 
        <Route path="/account-reuploadIdproof" element={<AccountReUploadIdProof />} />
        <Route path="/account-blocked" element={<AccountBlocked />} />


      </Routes>
    </Router>
  );
};

export default App;
