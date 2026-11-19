import React from 'react';
import { Navigate } from 'react-router-dom';

export default function Stream() {
  return <Navigate to="/admin/streaming" replace />;
}
