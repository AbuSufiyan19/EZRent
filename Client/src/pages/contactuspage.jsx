import React,{useEffect} from "react";
import CustomerNavbar from "../components/customernavbar/customernavbar";
import Footer from "../components/footer/footer";
import ContactUs from "../components/contactus/contactus"


const ContactUsPage = () => {
   useEffect(() => {
        window.scrollTo(0, 0);
      }, []);
  
  return (
    <>
      <CustomerNavbar />
      <ContactUs />
      <Footer />
    </>
  );
};

export default ContactUsPage;
