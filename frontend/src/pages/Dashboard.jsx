import { useEffect, useMemo, useState } from "react";
import api from "../api";
const cropImages = {
    Rice: "/src/assets/rice.jpg",
    Wheat: "/src/assets/wheat.jpg",
    Maize: "/src/assets/maize.jpg",
    Cotton: "/src/assets/cotton.jpg",
    Sugarcan: "/src/assets/sugarcane.jpg"
};

function Dashboard() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await api.get("/predict/history");
                setHistory(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    const stats = useMemo(() => {
        const total = history.length;
        const cropCount = {};
        let totalProfit = 0;

        history.forEach((item) => {
            cropCount[item.predictedCrop] = (cropCount[item.predictedCrop] || 0) + 1;
            totalProfit += Number(item.profitEstimate || 0);
        });

        let topCrop = "-";
        let maxCount = 0;

        for (const crop in cropCount) {
            if (cropCount[crop] > maxCount) {
                maxCount = cropCount[crop];
                topCrop = crop;
            }
        }

        const avgProfit = total > 0 ? Math.round(totalProfit / total) : 0;

        return { total, topCrop, avgProfit };
    }, [history]);

    return (
        <div className="page">
            <div className="dashboard-header">
                <div>
                    <h1 className="page-title">Prediction Dashboard</h1>
                    <p className="page-subtitle">
                        Review your crop predictions, compare outcomes, and explore crop options visually.
                    </p>
                </div>
            </div>

            <div className="summary-grid">
                <div className="summary-card">
                    <h4>Total Predictions</h4>
                    <p>{stats.total}</p>
                </div>
                <div className="summary-card">
                    <h4>Most Predicted Crop</h4>
                    <p>{stats.topCrop}</p>
                </div>
                <div className="summary-card">
                    <h4>Average Profit</h4>
                    <p>₹ {stats.avgProfit}</p>
                </div>
            </div>

            <div className="image-options">
                <h2 className="section-title">Crop Image Options</h2>
                <div className="image-grid">
                    {Object.entries(cropImages).map(([name, url]) => (
                        <div key={name} className="image-card">
                            <img src={url} alt={name} className="crop-image" />
                            <div className="image-card-content">
                                <h3>{name}</h3>
                                <span className="badge">Visual Option</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="section-space">
                <h2 className="section-title">Prediction History</h2>

                {loading ? (
                    <p className="loading">Loading prediction history...</p>
                ) : history.length === 0 ? (
                    <p className="page-subtitle">No prediction history found yet.</p>
                ) : (
                    <div className="card-grid">
                        {history.map((item) => {
                            const imageUrl =
                                cropImages[item.predictedCrop] ||
                                "https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=1200&auto=format&fit=crop";

                            return (
                                <div key={item._id} className="dashboard-card">
                                    <img
                                        src={imageUrl}
                                        alt={item.predictedCrop}
                                        className="dashboard-card-image"
                                    />

                                    <div className="dashboard-card-body">
                                        <div className="dashboard-card-top">
                                            <h3>{item.predictedCrop}</h3>
                                            <span className="confidence-pill">
                                                {item.confidence || 0}% confidence
                                            </span>
                                        </div>

                                        <div className="info-grid">
                                            <div className="info-box">
                                                <small>Yield</small>
                                                <strong>{item.yieldEstimate}</strong>
                                            </div>
                                            <div className="info-box">
                                                <small>Profit</small>
                                                <strong>₹ {item.profitEstimate}</strong>
                                            </div>
                                        </div>

                                        <p><strong>Fertilizer:</strong> {item.fertilizerAdvice}</p>
                                        <p><strong>Irrigation:</strong> {item.irrigationAdvice}</p>

                                        {item.alternatives?.length > 0 && (
                                            <div className="badges">
                                                {item.alternatives.map((alt, index) => (
                                                    <span key={index} className="badge">
                                                        {alt}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        <p className="card-date">
                                            {new Date(item.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;