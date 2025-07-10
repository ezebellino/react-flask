// src/front/pages/Logout.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
    const navigate = useNavigate();
    useEffect(() => {
        localStorage.removeItem("token");
        navigate("/login");
        // quiero que se actualice el botón del Navbar
        window.dispatchEvent(new Event("storage"));
    }, []);
    return null;
};

export default Logout;
