import { useEffect, useState } from "react";
import api from "../api";

const cropImages = {
    Rice: "https://images.unsplash.com/photo-1536058509160-ce3c52f6be1b?q=80&w=1200&auto=format&fit=crop",
    Wheat: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop",
    Maize: "https://images.unsplash.com/photo-1601593768799-76d1c57f55e1?q=80&w=1200&auto=format&fit=crop",
    Cotton: "https://images.unsplash.com/photo-1592928302636-c83cf1e1f9b1?q=80&w=1200&auto=format&fit=crop",
    Mungbean: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=1200&auto=format&fit=crop"
};

function Predict() {
    const [formData, setFormData] = useState({
        farmId: "",
        N: "",
        P: "",
        K: "",
        temperature: "",
        humidity: "",
        ph: "",
        rainfall: "",
        soil_type: "",
        season: "",
        land_area: "",
        budget: ""
    });

    const [result, setResult] = useState(null);
    const [farms, setFarms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchFarms = async () => {
            try {
                const res = await api.get("/farms");
                setFarms(res.data);
            } catch (err) {
                console.error("Failed to fetch farms:", err);
            }
        };

        fetchFarms();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "farmId") {
            const selectedFarm = farms.find((farm) => farm._id === value);

            setFormData((prev) => ({
                ...prev,
                farmId: value,
                soil_type: selectedFarm?.soilType || "",
                season: selectedFarm?.season || "",
                land_area: selectedFarm?.landArea ? String(selectedFarm.landArea) : prev.land_area
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleReset = () => {
        setFormData({
            farmId: "",
            N: "",
            P: "",
            K: "",
            temperature: "",
            humidity: "",
            ph: "",
            rainfall: "",
            soil_type: "",
            season: "",
            land_area: "",
            budget: ""
        });
        setResult(null);
        setError("");
    };

    const handleSampleFill = () => {
        setFormData((prev) => ({
            ...prev,
            N: "90",
            P: "42",
            K: "43",
            temperature: "25",
            humidity: "80",
            ph: "6.5",
            rainfall: "200",
            land_area: prev.land_area || "2",
            budget: "50000",
            soil_type: prev.soil_type || "Loamy",
            season: prev.season || "Kharif"
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (
            !formData.N ||
            !formData.P ||
            !formData.K ||
            !formData.temperature ||
            !formData.humidity ||
            !formData.ph ||
            !formData.rainfall ||
            !formData.land_area ||
            !formData.budget
        ) {
            setError("Please fill all required fields.");
            setLoading(false);
            return;
        }

        try {
            const payload = {
                farmId: formData.farmId || "",
                N: Number(formData.N),
                P: Number(formData.P),
                K: Number(formData.K),
                temperature: Number(formData.temperature),
                humidity: Number(formData.humidity),
                ph: Number(formData.ph),
                rainfall: Number(formData.rainfall),
                land_area: Number(formData.land_area),
                budget: Number(formData.budget),
                soil_type: formData.soil_type,
                season: formData.season
            };

            const res = await api.post("/predict", payload);
            setResult(res.data.result);
        } catch (err) {
            console.error("Prediction failed:", err);
            setError(
                err.response?.data?.message ||
                err.response?.data?.error ||
                "Prediction failed"
            );
        } finally {
            setLoading(false);
        }
    };

    const selectedFarm = farms.find((farm) => farm._id === formData.farmId);

    const predictedImage =
        result && cropImages[result.predicted_crop]
            ? cropImages[result.predicted_crop]
            : "https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=1200&auto=format&fit=crop";

    return (
        <main className="page">
            <div className="dashboard-hero">
                <div className="dashboard-hero-content">
                    <span className="hero-kicker">AI Crop Prediction</span>
                    <h1 className="page-title">Predict the Best Crop</h1>
                    <p className="page-subtitle">
                        Enter your farm and soil values to get the best crop recommendation,
                        expected yield, profit estimate, irrigation advice, and alternatives.
                    </p>
                </div>

                <div className="dashboard-hero-actions">
                    <div className="hero-mini-card">
                        <span>Smart Analysis</span>
                        <strong>ML Based</strong>
                    </div>
                    <div className="hero-mini-card">
                        <span>Output</span>
                        <strong>Crop + Profit</strong>
                    </div>
                </div>
            </div>

            <div className="split-layout section-space">
                <form className="form-card large" onSubmit={handleSubmit}>
                    <h2 className="form-title">Crop Prediction Form</h2>
                    <p className="form-subtitle">
                        Fill in the environmental and nutrient values for accurate prediction.
                    </p>

                    <div className="form-group">
                        <label className="form-label">Select Farm</label>
                        <select
                            className="select"
                            name="farmId"
                            value={formData.farmId}
                            onChange={handleChange}
                        >
                            <option value="kanpur">Kanpur Farm</option>
                            <option value="lucknow">Lucknow Farm</option>
                            <option value="agra">Agra Farm</option>
                            <option value="meerut">Meerut Farm</option>
                            <option value="varanasi">Varanasi Farm</option>

                            {farms.map((farm) => (
                                <option key={farm._id} value={farm._id}>
                                    {farm.location} | {farm.soilType} | {farm.landArea} acres | {farm.season}
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedFarm && (
                        <div className="farm-card" style={{ marginBottom: "18px" }}>
                            <h3>Selected Farm</h3>
                            <p><strong>Location:</strong> {selectedFarm.location}</p>
                            <p><strong>Soil Type:</strong> {selectedFarm.soilType}</p>
                            <p><strong>Land Area:</strong> {selectedFarm.landArea}</p>
                            <p><strong>Season:</strong> {selectedFarm.season}</p>
                        </div>
                    )}

                    <div className="grid-2">
                        <div className="form-group">
                            <label className="form-label">Nitrogen</label>
                            <input
                                className="input"
                                name="N"
                                placeholder="e.g. 90"
                                value={formData.N}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Phosphorus</label>
                            <input
                                className="input"
                                name="P"
                                placeholder="e.g. 42"
                                value={formData.P}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Potassium</label>
                            <input
                                className="input"
                                name="K"
                                placeholder="e.g. 43"
                                value={formData.K}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Temperature</label>
                            <input
                                className="input"
                                name="temperature"
                                placeholder="e.g. 25"
                                value={formData.temperature}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Humidity</label>
                            <input
                                className="input"
                                name="humidity"
                                placeholder="e.g. 80"
                                value={formData.humidity}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">pH</label>
                            <input
                                className="input"
                                name="ph"
                                placeholder="e.g. 6.5"
                                value={formData.ph}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Rainfall</label>
                            <input
                                className="input"
                                name="rainfall"
                                placeholder="e.g. 200"
                                value={formData.rainfall}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Land Area</label>
                            <input
                                className="input"
                                name="land_area"
                                placeholder="e.g. 2"
                                value={formData.land_area}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Budget</label>
                            <input
                                className="input"
                                name="budget"
                                placeholder="e.g. 50000"
                                value={formData.budget}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Soil Type</label>
                            <input
                                className="input"
                                name="soil_type"
                                placeholder="Optional UI field"
                                value={formData.soil_type}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Season</label>
                            <input
                                className="input"
                                name="season"
                                placeholder="Optional UI field"
                                value={formData.season}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {error && <p className="error">{error}</p>}
                    {loading && <p className="loading">Generating prediction...</p>}

                    <div style={{ display: "grid", gap: "12px", marginTop: "12px" }}>
                        <button
                            className="btn btn-primary btn-full"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Predicting..." : "Predict Crop"}
                        </button>

                        <button
                            type="button"
                            className="btn btn-outline btn-full"
                            onClick={handleSampleFill}
                        >
                            Fill Sample Input
                        </button>

                        <button
                            type="button"
                            className="btn btn-outline btn-full"
                            onClick={handleReset}
                        >
                            Reset Form
                        </button>
                    </div>
                </form>

                <aside className="result-panel">
                    <h2 className="result-title">Prediction Result</h2>

                    {!result ? (
                        <div className="empty-state">
                            <h3>No prediction yet</h3>
                            <p>Submit the form to view your predicted crop and insights.</p>
                        </div>
                    ) : (
                        <div className="result-card">
                            <img
                                src={predictedImage}
                                alt={result.predicted_crop}
                                className="dashboard-card-image"
                                style={{ borderRadius: "18px", marginBottom: "16px" }}
                            />

                            <h3>{result.predicted_crop}</h3>

                            <p className="result-row">
                                <strong>Confidence:</strong>{" "}
                                {result.confidence !== null && result.confidence !== undefined
                                    ? `${result.confidence}%`
                                    : "N/A"}
                            </p>

                            <p className="result-row">
                                <strong>Yield Estimate:</strong> {result.yield_estimate}
                            </p>

                            <p className="result-row">
                                <strong>Profit Estimate:</strong> ₹ {result.profit_estimate}
                            </p>

                            <p className="result-row">
                                <strong>Fertilizer Advice:</strong> {result.fertilizer_advice}
                            </p>

                            <p className="result-row">
                                <strong>Irrigation Advice:</strong> {result.irrigation_advice}
                            </p>

                            {result.budget_advice && (
                                <p className="result-row">
                                    <strong>Budget Advice:</strong> {result.budget_advice}
                                </p>
                            )}

                            {result.water_advice && (
                                <p className="result-row">
                                    <strong>Water Advice:</strong> {result.water_advice}
                                </p>
                            )}

                            {result.alternatives?.length > 0 && (
                                <div className="badges">
                                    {result.alternatives.map((item, index) => (
                                        <span key={index} className="badge">
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </aside>
            </div>
        </main>
    );
}

export default Predict;