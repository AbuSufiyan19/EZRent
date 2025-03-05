import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../utils/configurl";
import "../css/checkoutpage.css";   
import ezrent from "/ezrent.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomerNavbar from "../components/customernavbar/customernavbar";
import Footer from "../components/footer/footer";

const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };
  
  // Function to format numbers to 2 decimal places
  const formatNumber = (num) => {
    return Number(num).toFixed(2);
  };

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingDetails = location.state || {}; 
  const [renterDetails, setRenterDetails] = useState(null);
  const [qrCode, setQrCode] = useState("");
  const [transactionId, setTransactionId] = useState("");   
  const [upitransactionId, setupitransactionId] = useState("");

  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
        mountedRef.current = false;
    };
}, []);


const generateQrCode = async (upiLink) => {
    try {
        const { data } = await axios.post(`${config.BASE_API_URL}/payment/generate-upi-qr`, { upiLink });
            setQrCode(data.qrCodeUrl);
    } catch (error) {
        toast.error("Failed to generate QR Code.");
    }
};

  useEffect(() => {
    if (bookingDetails.renterId) {
      fetchRenterDetails(bookingDetails.renterId);
    }
  }, [bookingDetails.renterId]);

  const fetchRenterDetails = async (renterId) => {
    try {
        const response = await axios.get(`${config.BASE_API_URL}/renter/renterdata/${renterId}`);
        if (mountedRef.current) {
            setRenterDetails(response.data);
        }
    } catch (error) {
        console.error("Error fetching renter details:", error);
    }
  };
  const handleUPIPayment = async () => {
    try {
        const response = await axios.post(`${config.BASE_API_URL}/payment/generate-upi-link`, {
            renterId: bookingDetails.renterId,
            amount: bookingDetails.totalprice,
            equipmentId: bookingDetails.equipId
        });

        if (!response.data.upiLink) {
            toast.error("Failed to generate UPI payment link. Please try again.");
            return;
        }
        setTransactionId(response.data.transactionId);
        const upiLink = response.data.upiLink;

        const isMobile = (() => {
            if (typeof window !== "undefined") {    
                const userAgent = navigator.userAgent.toLowerCase();
                const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 1;
                
                // Detect mobile OS but exclude Windows/Mac/Linux (desktops)
                return (
                    /android|iphone|ipad|ipod/i.test(userAgent) &&
                    !/windows|macintosh|linux/i.test(userAgent) &&
                    hasTouch
                );
            }
            return false;
        })();
        
            
        if (isMobile) {
            // ✅ Mobile: Open UPI link
            window.location.href = upiLink;
        } else {
            // ✅ Desktop: Show QR Code
            generateQrCode(upiLink);
        }

    } catch (error) {
        console.error("Error processing UPI payment:", error);
        alert("Payment processing failed. Please try again.");
    }
};
const handleConfirmPayment = async () => {
    if (!upitransactionId.trim()) {
        toast.error("Transaction ID is missing. Complete the payment first.");
        return;
    }
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("User authentication failed. Please log in again.");
            return;
        }        
            const response = await axios.post(`${config.BASE_API_URL}/bookings/book`, {
                equipId: bookingDetails.equipId,
                renterId: bookingDetails.renterId,
                equipmentId: bookingDetails.equipmentId,
                equipimg: bookingDetails.equipimg,
                fromDateTime: bookingDetails.fromdate,
                toDateTime: bookingDetails.todate,
                totalHours: bookingDetails.totalhours,
                totalPrice: bookingDetails.totalprice,
                transactionId,
                upitransactionId,
                paymentStatus: "Pending"
            }, { 
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.status === 200 && response.data?.booking?._id) {
                toast.success("Booking successful!");
                setupitransactionId("");
            
                try {
                    await Promise.all([
                         axios.post(`${config.BASE_API_URL}/bookings/save-datacsv`, {
                            bookingId: response.data.booking._id,
                            equipmentId: response.data.equipment._id
                        }),
                
                         axios.post(`${config.BASE_API_URL}/bookings/send-booking-email`, { 
                            bookingId: response.data.booking._id 
                        })  
                    ]);
            
                    setTimeout(() => {
                        navigate("/mybookings");
                    }, 2000);
                } catch (error) {
                    console.error("Post-booking tasks failed:", error);
                    toast.error("Error processing booking details. Please check again.");
                }
            } else {
                toast.error("Unexpected response. Please try again.");
            }
            
        } catch (error) {
            toast.error("Payment confirmation failed. Please try again.");
        }
};



  return (
    <>
    <CustomerNavbar />
         <ToastContainer position="top-right" autoClose={3000} />
    <div className="checkout-container">
      {/* Left Section - Shopping Cart */}
      <div className="shopping-cart">
        <h2>Checkout</h2>
        <div className="cart-item">
          <img src={bookingDetails.equipimg} alt="Equipment" className="cart-img" />
          <div className="cart-details">
            <p><strong>Equipment ID:</strong> {bookingDetails.equipId}</p>
            <p><strong>Equipment Name:</strong> {bookingDetails.eqname}</p>

            {renterDetails && (
                <div>
                <p><strong>Renter Name:</strong> {renterDetails.fullName}</p>
                <p><strong>Contact Number:</strong> {renterDetails.mobileNumber}</p>
                <p><strong>Email:</strong> {renterDetails.email}</p>
                </div>
            )}
            <p><strong>From:</strong> {formatDateTime(bookingDetails.fromdate)}</p>
            <p><strong>To:</strong> {formatDateTime(bookingDetails.todate)}</p>
            <p><strong>Total Hours:</strong> {formatNumber(bookingDetails.totalhours)} hrs</p>
          </div>
        </div>
        <hr />
        <div className="summary">
          {/* <p><strong>Subtotal:</strong> ₹{bookingDetails.totalprice}</p>
          <p><strong>Discount:</strong> -₹0.00</p>
          <p><strong>Shipping:</strong> Free</p> */}
          <h3><strong>Total Amount :</strong> ₹ {formatNumber(bookingDetails.totalprice)}</h3>
          <div className="qrcontainer">
        {qrCode && (
                <div>
                <p>Enter your UPI Transaction-Id for payment confirmation.</p>
                    <div className="payment-options">
                    <input
                        type="text"
                        placeholder="Your UPI Transaction-Id"
                        className="tnx-input"
                        value={upitransactionId}
                        onChange={(e) => setupitransactionId(e.target.value)}
                    />                        
                    <button className="confirmtnx-btn" onClick={handleConfirmPayment}>Confirm Payment</button>
                    </div>
                </div>
            )}
        </div>
        </div>
      </div>

      {/* Right Section - Checkout Form */}
      <div className="checkout-form">
        <div className="logocontainercheckout">
            <div>
                <img src={ezrent} alt="EZRent" className="ezrent" width={150} />
            </div>
        </div>
        <button className="checkout-btn">Checkout</button>

        {/* Payment Options */}
        <div className="payment-options">
        <button className="upi-btn" onClick={handleUPIPayment}>
            Pay Using UPI
        </button>          
        <button className="gateway-btn">Pay Using Payment Gateway</button>
        </div>
        <div className="qrcontainer">
        {qrCode && (
                <div>
                    <p>Scan this QR Code to Pay:</p>
                    <img src={qrCode} alt="UPI QR Code" />
                </div>
            )}
        </div>

        {/* Next Steps */}
        <div className="next-steps">
          <h3>Steps</h3>
          <p><strong>Payment information:</strong> Choose a payment method.</p>
          <p><strong>Order confirmation:</strong> You'll receive an email confirmation once you confirm payment.</p>
        </div>
      </div>
    </div>
    <Footer />  
    </>
  );
};

export default CheckoutPage;
