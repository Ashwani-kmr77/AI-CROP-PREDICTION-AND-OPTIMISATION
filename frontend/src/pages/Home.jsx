import { Link } from "react-router-dom";

function Home() {
    return (
        <div className="page hero-layout">
            <div className="hero-card">
                <span className="hero-kicker">AI + Smart Farming</span>
                <h1 className="hero-title">
                    AI Powered Crop Prediction and Optimization
                </h1>
                <p className="hero-text">
                    Predict the most suitable crop using soil and environmental values,
                    estimate yield and profit, and get fertilizer plus irrigation advice
                    through an easy full-stack dashboard.
                </p>

                <div className="hero-actions">
                    <Link to="/signup" className="btn btn-primary">
                        Get Started
                    </Link>
                    <Link to="/predict" className="btn btn-outline">
                        Try Prediction
                    </Link>
                </div>
            </div>

            <div className="hero-visual">
                <div className="hero-visual-grid">
                    <div className="hero-stat">
                        <strong>95%+</strong>
                        <h3>Model-Based Recommendation</h3>
                        <p>Crop suggestions powered by a trained machine learning model.</p>
                    </div>

                    <div className="hero-stat">
                        <strong>Yield</strong>
                        <h3>Production Estimation</h3>
                        <p>Get expected yield and projected profit from your inputs.</p>
                    </div>

                    <div className="hero-stat">
                        <strong>History</strong>
                        <h3>Track Previous Predictions</h3>
                        <p>Save, review, and compare old crop recommendations easily.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;