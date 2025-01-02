import React from 'react';
import './mybooking.css';

const MyBooking = () => {
  // Sample booking data
  const bookings = [
    {
      id: 1,
      image: 'https://via.placeholder.com/100',
      name: 'Excavator',
      price: '$500/day',
      status: 'Confirmed',
    },
    {
      id: 2,
      image: 'https://via.placeholder.com/100',
      name: 'Bulldozer',
      price: '$450/day',
      status: 'Pending',
    },
    {
      id: 3,
      image: 'https://via.placeholder.com/100',
      name: 'Crane',
      price: '$600/day',
      status: 'Cancelled',
    },
    {
        id: 3,
        image: 'https://via.placeholder.com/100',
        name: 'Crane',
        price: '$600/day',
        status: 'Cancelled',
      },{
        id: 3,
        image: 'https://via.placeholder.com/100',
        name: 'Crane',
        price: '$600/day',
        status: 'Cancelled',
      },{
        id: 3,
        image: 'https://via.placeholder.com/100',
        name: 'Crane',
        price: '$600/day',
        status: 'Cancelled',
      },{
        id: 3,
        image: 'https://via.placeholder.com/100',
        name: 'Crane',
        price: '$600/day',
        status: 'Cancelled',
      },{
        id: 3,
        image: 'https://via.placeholder.com/100',
        name: 'Crane',
        price: '$600/day',
        status: 'Cancelled',
      },{
        id: 3,
        image: 'https://via.placeholder.com/100',
        name: 'Crane',
        price: '$600/day',
        status: 'Cancelled',
      },{
        id: 3,
        image: 'https://via.placeholder.com/100',
        name: 'Crane',
        price: '$600/day',
        status: 'Cancelled',
      },{
        id: 3,
        image: 'https://via.placeholder.com/100',
        name: 'Crane',
        price: '$600/day',
        status: 'Cancelled',
      },{
        id: 3,
        image: 'https://via.placeholder.com/100',
        name: 'Crane',
        price: '$600/day',
        status: 'Cancelled',
      },{
        id: 3,
        image: 'https://via.placeholder.com/100',
        name: 'Crane',
        price: '$600/day',
        status: 'Cancelled',
      },{
        id: 3,
        image: 'https://via.placeholder.com/100',
        name: 'Crane',
        price: '$600/day',
        status: 'Cancelled',
      },{
        id: 3,
        image: 'https://via.placeholder.com/100',
        name: 'Crane',
        price: '$600/day',
        status: 'Cancelled',
      },
  ];

  return (
    <div className="my-booking-container">
      <h2 className="mybooking-heading">My Bookings</h2>
      <table className="my-booking-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td className="image-cell">
                <img src={booking.image} alt={booking.name} />
              </td>
              <td>{booking.name}</td>
              <td>{booking.price}</td>
              <td>{booking.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyBooking;
