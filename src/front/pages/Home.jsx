// import React, { useEffect } from "react"
// import rigoImageUrl from "../assets/img/rigo-baby.jpg";
// import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

// export const Home = () => {

// 	const { store, dispatch } = useGlobalReducer()

// 	const loadMessage = async () => {
// 		try {
// 			const backendUrl = import.meta.env.VITE_BACKEND_URL

// 			if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file")

// 			const response = await fetch(backendUrl + "/api/hello")
// 			const data = await response.json()

// 			if (response.ok) dispatch({ type: "set_hello", payload: data.message })

// 			return data

// 		} catch (error) {
// 			if (error.message) throw new Error(
// 				`Could not fetch the message from the backend.
// 				Please check if the backend is running and the backend port is public.`
// 			);
// 		}

// 	}

// 	useEffect(() => {
// 		loadMessage()
// 	}, [])

// 	return (
// 		<div className="text-center mt-5">
// 			<h1 className="display-4">Hello Rigo!!</h1>
// 			<p className="lead">
// 				<img src={rigoImageUrl} className="img-fluid rounded-circle mb-3" alt="Rigo Baby" />
// 			</p>
// 			<div className="alert alert-info">
// 				{store.message ? (
// 					<span>{store.message}</span>
// 				) : (
// 					<span className="text-danger">
// 						Loading message from the backend (make sure your python 🐍 backend is running)...
// 					</span>
// 				)}
// 			</div>
// 		</div>
// 	);
// }; 

// src/front/pages/Home.jsx
import { Link } from "react-router-dom";

const Home = () => (
	<div className="page-home">
		<h1>Bienvenido a tu ToDoList</h1>
		<p>Para comenzar, por favor:</p>
		<div className="d-flex gap-2">
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

