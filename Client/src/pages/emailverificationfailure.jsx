import React from 'react';

const EmailVerificationFailure = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1 style={{ color: 'green' }}>Email Verification Failed!</h1>
      <p>Invalid or Expired Token.</p>
    </div>
  );
};

export default EmailVerificationFailure;
