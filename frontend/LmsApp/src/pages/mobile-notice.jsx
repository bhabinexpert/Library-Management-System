import React from 'react';
import './mobile-notice.css';

const MobileNotice = () => {
  return (
    <div className="mobile-notice-container">
      <div className="mobile-notice-animation">
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="50" stroke="#4F8A8B" strokeWidth="8" fill="none" />
          <text x="50%" y="50%" textAnchor="middle" dy=".3em" fontSize="22" fill="#4F8A8B">📱</text>
        </svg>
      </div>
      <h2>Mobile Version Coming Soon!</h2>
      <p>
        Thank you for visiting our Library Management System.<br />
        The mobile experience is currently under development.<br />
        For the best experience, please access the website via desktop.<br />
        <span className="kind-message">We appreciate your patience and support!</span>
      </p>
    </div>
  );
};

export default MobileNotice;
