import { useContext, useState } from "react";
import { ProductContext } from "../Contexts/ProductContext";
import { UserContext } from "../Contexts/UserContext";
import { useNavigate } from "react-router-dom";
import '../components/StoreWish.css';

export default function ManageProducts() {
    const { products, updateProduct, deleteProduct } = useContext(ProductContext);
    const { current_user } = useContext(UserContext);
    const navigate = useNavigate();

    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editPrice, setEditPrice] = useState("");
    const [editAvailability, setEditAvailability] = useState("");
    const [search, setSearch] = useState("");

    // Redirect if not admin
    if (current_user && current_user.role?.toLowerCase() !== "admin") {
        navigate("/store");
        return null;
    }

    const handleEdit = (product) => {
        setEditingId(product.id);
        setEditName(product.name);
        setEditDescription(product.description);
        setEditPrice(product.price);
        setEditAvailability(product.availability);
    };

    const handleSave = (product_id) => {
        updateProduct(
            product_id,
            editName,
            editDescription,
            parseFloat(editPrice),
            parseInt(editAvailability),
        );
        setEditingId(null);
    };

    const handleCancel = () => {
        setEditingId(null);
    };

    const handleDelete = (id, name) => {
        if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
            deleteProduct(id);
        }
    };

    const filteredProducts = products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="mp-wrapper">
            <div className="mp-header">
                <div className="mp-header-left">
                    <h1 className="mp-title">Manage Products</h1>
                    <span className="mp-count">{products.length} products</span>
                </div>
                <button className="mp-add-btn" onClick={() => navigate("/addproduct")}>
                    + Add Product
                </button>
            </div>

            {/* Search */}
            <input
                type="text"
                className="mp-search"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {filteredProducts.length === 0 ? (
                <div className="mp-empty">
                    <p>No products found.</p>
                </div>
            ) : (
                <div className="mp-table-wrapper">
                    <table className="mp-table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Price ($)</th>
                                <th>Stock</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map((product) => (
                                <tr key={product.id}>
                                    {editingId === product.id ? (
                                        // Editing
                                        <>
                                            <td>
                                                <img
                                                    src={`https://crown-and-carre.onrender.com/static/uploads/${product.image_filename}`}
                                                    alt={product.name}
                                                    className="mp-table-img"
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    className="mp-edit-input"
                                                    value={editName}
                                                    onChange={(e) => setEditName(e.target.value)}
                                                />
                                            </td>
                                            <td>
                                                <textarea
                                                    className="mp-edit-input mp-edit-textarea"
                                                    value={editDescription}
                                                    onChange={(e) => setEditDescription(e.target.value)}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    className="mp-edit-input mp-edit-short"
                                                    type="number"
                                                    value={editPrice}
                                                    onChange={(e) => setEditPrice(e.target.value)}
                                                    min="0"
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    className="mp-edit-input mp-edit-short"
                                                    type="number"
                                                    value={editAvailability}
                                                    onChange={(e) => setEditAvailability(e.target.value)}
                                                    min="0"
                                                />
                                            </td>
                                            <td>
                                                <div className="mp-actions">
                                                    <button
                                                        className="mp-save-btn"
                                                        onClick={() => handleSave(product.id)}
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        className="mp-cancel-btn"
                                                        onClick={handleCancel}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </td>
                                        </>
                                    ) : (
                                        // Viewing
                                        <>
                                            <td>
                                                <img
                                                    src={`https://crown-and-carre.onrender.com/static/uploads/${product.image_filename}`}
                                                    alt={product.name}
                                                    className="mp-table-img"
                                                />
                                            </td>
                                            <td className="mp-name">{product.name}</td>
                                            <td className="mp-desc">{product.description}</td>
                                            <td>${product.price}</td>
                                            <td>
                                                <span className={`mp-stock-badge ${product.availability > 0 ? "in-stock" : "out-stock"}`}>
                                                    {product.availability > 0 ? `${product.availability} left` : "Out of Stock"}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="mp-actions">
                                                    <button
                                                        className="mp-edit-btn"
                                                        onClick={() => handleEdit(product)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="mp-delete-btn"
                                                        onClick={() => handleDelete(product.id, product.name)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}