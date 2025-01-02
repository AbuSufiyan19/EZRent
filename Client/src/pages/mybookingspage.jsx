import React from "react";
import CustomerNavbar from "../components/customernavbar/customernavbar";
import Footer from "../components/footer/footer";
import MyBookings from "../components/mybookings/mybooking"


const MyBookingsPage = () => {
  return (
    <>
      <CustomerNavbar />
      <MyBookings />
      <Footer />
    </>
  );
};

export default MyBookingsPage;
