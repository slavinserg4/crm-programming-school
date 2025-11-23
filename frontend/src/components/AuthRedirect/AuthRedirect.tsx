import React from 'react';
import { Navigate } from 'react-router-dom';

interface AuthRedirectProps {
    children: React.ReactNode;
}

const AuthRedirect: React.FC<AuthRedirectProps> = ({ children }) => {
    const isLoggedIn = sessionStorage.getItem("login") === "true";

    if (isLoggedIn) {
        return <Navigate to="/orders" replace />;
    }

    return <>{children}</>;
};

export default AuthRedirect;