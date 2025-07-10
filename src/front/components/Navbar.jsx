import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
	const navigate = useNavigate();
	const location = useLocation();

	// fuerza el re-render al cambiar de ruta y recalcular isLoggedIn
	React.useEffect(() => { }, [location]);

	// recalcula auth en cada render
	const isLoggedIn = !!localStorage.getItem("token");

	const handleLogout = () => {
		localStorage.removeItem("token");
		navigate("/login");
	};

	return (
		<nav className="navbar navbar-dark bg-dark">
			<div className="container">
				<Link to="/" className="navbar-brand">
					Home
				</Link>
				<div className="d-flex gap-2">
					{isLoggedIn ? (
						<button className="btn btn-danger" onClick={handleLogout}>
							Logout
						</button>
					) : (
						<>
							<Link to="/login">
								<button className="btn btn-primary">Login</button>
							</Link>
							<Link to="/register">
								<button className="btn btn-secondary">Register</button>
							</Link>
						</>
					)}
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
