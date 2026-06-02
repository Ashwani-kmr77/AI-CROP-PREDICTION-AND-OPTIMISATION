import { useEffect, useState } from "react";
import api from "../api";

function Farm() {
    const [form, setForm] = useState({
        location: "",
        soilType: "",
        landArea: "",
        season: "",
        notes: "",
        farmImage: null
    });

    const [farms, setFarms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState("");

    const fetchFarms = async () => {
        try {
            const res = await api.get("/farms");
            setFarms(res.data);
        } catch (err) {
            console.error("Error fetching farms:", err.response?.data || err.message);
            alert("Failed to load farms");
        }
    };

    useEffect(() => {
        fetchFarms();
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "farmImage") {
            const file = files[0];
            setForm((prev) => ({
                ...prev,
                farmImage: file
            }));

            if (file) {
                setPreview(URL.createObjectURL(file));
            } else {
                setPreview("");
            }
            return;
        }

        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.location || !form.soilType || !form.landArea || !form.season) {
            alert("Please fill all required fields");
            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("location", form.location);
            formData.append("soilType", form.soilType);
            formData.append("landArea", form.landArea);
            formData.append("season", form.season);
            formData.append("notes", form.notes);

            if (form.farmImage) {
                formData.append("farmImage", form.farmImage);
            }

            await api.post("/farms", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            setForm({
                location: "",
                soilType: "",
                landArea: "",
                season: "",
                notes: "",
                farmImage: null
            });

            setPreview("");
            fetchFarms();
        } catch (err) {
            console.error("Error saving farm:", err.response?.data || err.message);
            alert(err.response?.data?.message || "Failed to save farm");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "30px" }}>
            <h2 style={{ marginBottom: "20px", color: "#14532d" }}>Farm Details</h2>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "30px",
                    alignItems: "start"
                }}
            >
                <form
                    onSubmit={handleSubmit}
                    style={{
                        border: "1px solid #d1d5db",
                        borderRadius: "12px",
                        padding: "20px",
                        background: "#f9fafb",
                        display: "grid",
                        gap: "16px"
                    }}
                >
                    <h3 style={{ margin: 0 }}>Add New Farm</h3>

                    <div>
                        <label style={{ display: "block", marginBottom: "6px", fontWeight: "600" }}>
                            Location
                        </label>
                        <input
                            type="text"
                            name="location"
                            placeholder="Enter farm location"
                            value={form.location}
                            onChange={handleChange}
                            style={inputStyle}
                        />
                    </div>

                    <div>
                        <label style={{ display: "block", marginBottom: "6px", fontWeight: "600" }}>
                            Soil Type
                        </label>
                        <input
                            type="text"
                            name="soilType"
                            placeholder="e.g. Loamy, Clay, Sandy"
                            value={form.soilType}
                            onChange={handleChange}
                            style={inputStyle}
                        />
                    </div>

                    <div>
                        <label style={{ display: "block", marginBottom: "6px", fontWeight: "600" }}>
                            Land Area (acres)
                        </label>
                        <input
                            type="number"
                            name="landArea"
                            placeholder="Enter land area"
                            value={form.landArea}
                            onChange={handleChange}
                            style={inputStyle}
                        />
                    </div>

                    <div>
                        <label style={{ display: "block", marginBottom: "6px", fontWeight: "600" }}>
                            Season
                        </label>
                        <select
                            name="season"
                            value={form.season}
                            onChange={handleChange}
                            style={inputStyle}
                        >
                            <option value="">Select season</option>
                            <option value="Kharif">Kharif</option>
                            <option value="Rabi">Rabi</option>
                            <option value="Zaid">Zaid</option>
                            <option value="All Season">All Season</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ display: "block", marginBottom: "6px", fontWeight: "600" }}>
                            Notes
                        </label>
                        <textarea
                            name="notes"
                            placeholder="Add extra details about the farm"
                            value={form.notes}
                            onChange={handleChange}
                            rows="4"
                            style={{ ...inputStyle, resize: "vertical" }}
                        />
                    </div>

                    <div>
                        <label style={{ display: "block", marginBottom: "6px", fontWeight: "600" }}>
                            Upload Farm Image
                        </label>
                        <input
                            type="file"
                            name="farmImage"
                            accept="image/*"
                            onChange={handleChange}
                            style={inputStyle}
                        />
                    </div>

                    {preview && (
                        <div>
                            <p style={{ fontWeight: "600", marginBottom: "8px" }}>Image Preview</p>
                            <img
                                src={preview}
                                alt="Preview"
                                style={{
                                    width: "100%",
                                    maxHeight: "220px",
                                    objectFit: "cover",
                                    borderRadius: "10px",
                                    border: "1px solid #ccc"
                                }}
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            background: "#166534",
                            color: "#fff",
                            border: "none",
                            padding: "12px",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: "600"
                        }}
                    >
                        {loading ? "Saving..." : "Add Farm"}
                    </button>
                </form>

                <div>
                    <h3 style={{ marginTop: 0 }}>Saved Farms</h3>

                    {farms.length === 0 ? (
                        <p>No farms added yet.</p>
                    ) : (
                        farms.map((farm) => (
                            <div
                                key={farm._id}
                                style={{
                                    border: "1px solid #d1d5db",
                                    borderRadius: "12px",
                                    padding: "16px",
                                    marginBottom: "16px",
                                    background: "#ffffff",
                                    boxShadow: "0 2px 6px rgba(0,0,0,0.06)"
                                }}
                            >
                                {farm.imageUrl && (
                                    <img
                                        src={farm.imageUrl}
                                        alt={farm.location}
                                        style={{
                                            width: "100%",
                                            height: "180px",
                                            objectFit: "cover",
                                            borderRadius: "10px",
                                            marginBottom: "12px"
                                        }}
                                    />
                                )}

                                <h4 style={{ margin: "0 0 10px 0", color: "#14532d" }}>
                                    {farm.location}
                                </h4>
                                <p><strong>Soil Type:</strong> {farm.soilType}</p>
                                <p><strong>Land Area:</strong> {farm.landArea} acres</p>
                                <p><strong>Season:</strong> {farm.season}</p>
                                <p><strong>Notes:</strong> {farm.notes || "No notes added"}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box"
};

export default Farm;