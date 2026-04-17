import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProductContext } from "../Contexts/ProductContext";
import { UserContext } from "../Contexts/UserContext";

export default function AddProduct() {
    const { addProduct } = useContext(ProductContext);
    const { current_user } = useContext(UserContext);
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [availability, setAvailability] = useState("");
    const [image_filename, setImageFilename] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    // Redirect if not admin
    if (current_user && current_user.role?.toLowerCase() !== "admin") {
        navigate("/store");
        return null;
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFilename(file);
            setPreview(URL.createObjectURL(file)); 
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !description || !price || !availability) {
            alert("Please fill in all required fields");
            return;
        }
        setLoading(true);
        addProduct(name, description, price, availability, image_filename);
        setLoading(false);
    };

    return (
        <div className="ap-wrapper">
            <div className="ap-header">
                <button className="ap-back" onClick={() => navigate(-1)}>
                    ← Back
                </button>
            </div>

            <h1 className="ap-title">Add New Product</h1>

            <div className="ap-container">
                {/* Image Upload */}
                <div className="ap-image-section">
                    <div
                        className="ap-image-drop"
                        onClick={() => document.getElementById("imageInput").click()}
                    >
                        {preview ? (
                            <img src={preview} alt="Preview" className="ap-preview" />
                        ) : (
                            <div className="ap-image-placeholder">
                                <span className="ap-upload-icon">＋</span>
                                <p>Click to upload image</p>
                                <span>PNG, JPG, JPEG, WEBP</span>
                            </div>
                        )}
                    </div>
 
                    <input
                        id="imageInput"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: "none" }}
                    />
                    {preview && (
                        <button
                            className="ap-remove-img"
                            onClick={() => { setPreview(null); setImageFilename(null); }}
                        >
                            Remove image
                        </button>
                    )}
                </div>

                {/* Form */}
                <form className="ap-form" onSubmit={handleSubmit}>
                    <div className="ap-field">
                        <label>Product Name <span>*</span></label>
                        <input
                            type="text"
                            placeholder="e.g. Girl In Flower Gardens"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="ap-input"
                        />
                    </div>

                    <div className="ap-field">
                        <label>Description <span>*</span></label>
                        <textarea
                            placeholder="Describe the product..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="ap-input ap-textarea"
                        />
                    </div>

                    <div className="ap-row">
                        <div className="ap-field">
                            <label>Price ($) <span>*</span></label>
                            <input
                                type="number"
                                placeholder="250"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="ap-input"
                                min="0"
                            />
                        </div>

                        <div className="ap-field">
                            <label>Stock / Availability <span>*</span></label>
                            <input
                                type="number"
                                placeholder="10"
                                value={availability}
                                onChange={(e) => setAvailability(e.target.value)}
                                className="ap-input"
                                min="0"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="ap-submit-btn"
                        disabled={loading}
                    >
                        {loading ? "Adding Product..." : "Add Product"}
                    </button>
                </form>
            </div>
        </div>
    );
}