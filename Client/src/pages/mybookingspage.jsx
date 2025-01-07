import React from "react";
import CustomerNavbar from "../components/customernavbar/customernavbar";
import Footer from "../components/footer/footer";
import MyBookings from "../components/mybookings/mybooking"
import { useRequireAuth } from "../utils/sessionutils";


const MyBookingsPage = () => {
  useRequireAuth();
  return (
    <>
      <CustomerNavbar />
      <MyBookings />
      <Footer />
    </>
  );
};

export default MyBookingsPage;
