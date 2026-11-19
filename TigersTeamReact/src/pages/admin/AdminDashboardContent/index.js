import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from 'authContext';
import { visibleAdminSections } from '../adminSections.mjs';
export default function AdminDashboardContent() {
  const { userRole } = useAuth();
  return (
    <>
      <div className="admin-quick-start">
        <p>
          <strong>Where to start</strong>
          <br />
          Reservations manages PC bookings. Product orders manages purchases
          customers have already placed. Product catalogue manages the products
          you offer for sale. Changes are saved to the connected API. This
          workspace is for the site administrator.
        </p>
      </div>
      <div className="admin-overview-grid">
        {visibleAdminSections(userRole).map((section) => (
          <Link
            className="admin-section-card"
            key={section.route}
            to={section.route}
          >
            <span className="admin-card-number">
              {section.icon} / OPERATIONS
            </span>
            <h2>{section.title}</h2>
            <p>{section.description}</p>
            <span className="admin-card-purpose">{section.purpose}</span>
            <span className="admin-card-action">OPEN WORKSPACE &rarr;</span>
          </Link>
        ))}
      </div>
    </>
  );
}
