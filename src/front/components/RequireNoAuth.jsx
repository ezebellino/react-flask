import { Navigate, Outlet } from "react-router-dom";

const RequireNoAuth = () => {
    return localStorage.getItem("token")
        ? <Navigate to="/tasks" replace />
        : <Outlet />;
};

export default RequireNoAuth;
