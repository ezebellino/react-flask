import { Navigate, Outlet, useLocation } from "react-router-dom";

const RequireAuth = () => {
    const location = useLocation();
    const isAuthenticated = localStorage.getItem("token");

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <Outlet />;
};

export default RequireAuth;
