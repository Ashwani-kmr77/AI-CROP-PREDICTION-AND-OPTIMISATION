import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

function Login() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await api.post("/auth/login", form);

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));

            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-page">
            <form className="form-card" onSubmit={handleSubmit}>
                <h2 className="form-title">Welcome Back</h2>
                <p className="form-subtitle">
                    Login to access your crop prediction dashboard
                </p>

                <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                        className="input"
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Password</label>
                    <input
                        className="input"
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                {error && <p className="error">{error}</p>}
                {loading && <p className="loading">Logging in...</p>}

                <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                    {loading ? "Please wait..." : "Login"}
                </button>

                <p style={{ marginTop: "16px", textAlign: "center", color: "#64748b" }}>
                    Don’t have an account?{" "}
                    <Link to="/signup" style={{ color: "#166534", fontWeight: "600" }}>
                        Signup
                    </Link>
                </p>
            </form>
        </div>
    );
}

export default Login;