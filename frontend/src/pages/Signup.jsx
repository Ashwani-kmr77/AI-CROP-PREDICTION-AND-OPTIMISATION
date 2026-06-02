import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

function Signup() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            await api.post("/auth/register", form);

            setSuccess("Account created successfully. Redirecting to login...");

            setTimeout(() => {
                navigate("/login");
            }, 1200);

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Signup failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-page">
            <form className="form-card" onSubmit={handleSubmit}>
                <h2 className="form-title">Create Account</h2>
                <p className="form-subtitle">
                    Sign up to start using the AI crop prediction dashboard
                </p>

                <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                        className="input"
                        type="text"
                        name="name"
                        placeholder="Enter your full name"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />
                </div>

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
                        placeholder="Create a password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}
                {loading && <p className="loading">Creating account...</p>}

                <button
                    type="submit"
                    className="btn btn-primary btn-full"
                    disabled={loading}
                >
                    {loading ? "Please wait..." : "Signup"}
                </button>

                <p style={{ marginTop: "16px", textAlign: "center", color: "#64748b" }}>
                    Already have an account?{" "}
                    <Link to="/login" style={{ color: "#166534", fontWeight: "600" }}>
                        Login
                    </Link>
                </p>
            </form>
        </div>
    );
}

export default Signup;