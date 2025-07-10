import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: form.email,
                    password: form.password,
                }),
            });
            const data = await response.json();
            if (!response.ok) {
                setError(data.msg || data.message || "Credenciales inválidas.");
            } else {
                localStorage.setItem("token", data.token);
                navigate("/tasks");
            }
        } catch {
            setError("Error de red.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container page-auth d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
            <div className="card bg-secondary text-light p-4" style={{ maxWidth: "400px", width: "100%" }}>
                <h2 className="mb-4 text-center">Iniciar Sesión</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Correo Electrónico</label>
                        <input
                            className="form-control"
                            type="email"
                            name="email"
                            placeholder="Correo electrónico"
                            value={form.email}
                            onChange={handleChange}
                            required
                            autoComplete="username"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Contraseña</label>
                        <input
                            className="form-control"
                            type="password"
                            name="password"
                            placeholder="Contraseña"
                            value={form.password}
                            onChange={handleChange}
                            required
                            autoComplete="current-password"
                        />
                    </div>
                    <button className="btn btn-primary w-100" type="submit" disabled={loading}>
                        {loading ? "Ingresando..." : "Entrar"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
