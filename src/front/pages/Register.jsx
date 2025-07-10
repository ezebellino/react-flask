import React, { useState } from "react";

const Register = () => {
    const [form, setForm] = useState({
        // username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
        setSuccess("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }
        setLoading(true);
        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    // username: form.username,
                    email: form.email,
                    password: form.password,
                }),
            });
            const data = await response.json();
            if (!response.ok) {
                setError(data.msg || data.message || "Error al registrar.");
            } else {
                setSuccess("Registro exitoso. Ahora puedes iniciar sesión.");
                setForm({ email: "", password: "", confirmPassword: "" });
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
                <h2 className="mb-4 text-center">Registro</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}
                <form onSubmit={handleSubmit}>
                    {/* <div className="mb-3">
                        <label className="form-label">Usuario</label>
                        <input
                            className="form-control"
                            type="text"
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            required
                            autoComplete="username"
                        />
                    </div> */}
                    <div className="mb-3">
                        <label className="form-label">Correo electrónico</label>
                        <input
                            className="form-control"
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            autoComplete="email"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Contraseña</label>
                        <input
                            className="form-control"
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            autoComplete="new-password"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Confirmar contraseña</label>
                        <input
                            className="form-control"
                            type="password"
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            required
                            autoComplete="new-password"
                        />
                    </div>
                    <button className="btn btn-primary w-100" type="submit" disabled={loading}>
                        {loading ? "Registrando..." : "Registrarse"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;