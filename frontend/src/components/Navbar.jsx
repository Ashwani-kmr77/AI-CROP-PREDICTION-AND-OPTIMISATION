import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <div className="nav-inner">
                <div className="nav-left">
                    <Link to="/" className="brand">
                        AgroAI
                    </Link>

                    <Link to="/" className="nav-link">
                        Home
                    </Link>

                    {token && (
                        <Link to="/predict" className="nav-link">
                            Predict
                        </Link>
                    )}

                    {token && (
                        <Link to="/dashboard" className="nav-link">
                            Dashboard
                        </Link>
                    )}

                    {token && (
                        <Link to="/farm" className="nav-link">
                            Farm
                        </Link>
                    )}
                </div>

                <div className="nav-right">
                    {!token ? (
                        <>
                            <Link to="/login" className="nav-link">
                                Login
                            </Link>
                            <Link to="/signup" className="btn btn-outline">
                                Signup
                            </Link>
                        </>
                    ) : (
                        <>
                            <span className="user-badge">Hi, {user?.name || "User"}</span>
                            <button onClick={logout} className="nav-btn">
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;