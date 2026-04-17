import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const token = localStorage.getItem('adminToken');

    if (!token) {
        // Kick unauthorized users back to home
        return <Navigate to="/" replace />;
    }

    // In a production app, we would verify the token with the backend here
    // but verifying the presence is enough for frontend routing since API 
    // calls will be blocked by the server anyway if token is invalid.
    return <>{children}</>;
};

export default ProtectedRoute;
