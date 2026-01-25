import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
    const adminInfo = localStorage.getItem('adminInfo');
    return adminInfo ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default PrivateRoute;
