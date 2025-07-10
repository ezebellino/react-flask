import { Link } from "react-router-dom";

const Home = () => (
	<div className="page-home">
		<h1 className="text-center mb-4">Bienvenido a tu ToDoList 📝</h1>
		<p className="text-center mb-4">Para comenzar, por favor:</p>
		<div className="d-flex gap-3 justify-content-center">
			<Link to="/login">
				<button className="btn btn-primary">Login</button>
			</Link>
			<Link to="/register">
				<button className="btn btn-secondary">Register</button>
			</Link>
		</div>
	</div>
);

export default Home;

