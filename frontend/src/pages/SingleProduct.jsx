import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ProductContext } from "../Contexts/ProductContext";
import { UserContext } from "../Contexts/UserContext";
import { ReviewContext } from "../Contexts/ReviewContext";
import { FaHeart, FaArrowLeft, FaStar } from "react-icons/fa";

export default function SingleProduct() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToWishlist, wishlist } = useContext(ProductContext);
    const { authToken, current_user } = useContext(UserContext);
    const isAdmin = current_user?.role?.toLowerCase() === "admin";

    // Product
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [ordering, setOrdering] = useState(false);
    const [orderMessage, setOrderMessage] = useState("");

    // Reviews
    const { reviews, fetchProductReviews, onChange, addReview, updateReview, deleteReview } = useContext(ReviewContext);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState(""); // Added missing comment state
    const [editingId, setEditingId] = useState(null);
    const [editRating, setEditRating] = useState(0);
    const [editComment, setEditComment] = useState("");

    // Wishlist
    const isInWishlist = wishlist?.some((item) => item.product_id === parseInt(id));

    // Fetch single product
    useEffect(() => {
        fetch(`http://127.0.0.1:5000/products/${id}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.id) {
                    setProduct(data);
                }
            })
            .catch((err) => console.error("Failed to fetch product:", err))
            .finally(() => setLoading(false));
    }, [id]);

      // Fetch Reviews 
    useEffect(() => {
        if (id) fetchProductReviews(id);
    }, [id, onChange]); 

    if (loading) return <div className="sp-loading">Loading...</div>;
    if (!product) return <div className="sp-loading">Product not found</div>;

    // Place order
    const handleOrder = () => {
        if (!authToken) {
            navigate("/login");
            return;
        }

        setOrdering(true);
        fetch("http://127.0.0.1:5000/orders", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({
                product_id: product.id,
                quantity: quantity,
            }),
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.message) {
                setOrderMessage(`✓ Order placed! Total: $${data.order.total_price}`);
            } else if (data.error) {
                setOrderMessage(`✗ ${data.error}`);
            }
        })
        .catch((err) => console.error("Order failed:", err))
        .finally(() => setOrdering(false));
    };

    // Submit a review
    const handleSubmitReview = () => {
        if (!authToken) { 
            navigate("/login"); 
            return; 
        }
        addReview(parseInt(id), rating, comment);
        setComment(""); 
        setRating(5);
    }

    // Edit
    const handleEdit = (review) => {
        setEditingId(review.id);
        setEditRating(review.rating);
        setEditComment(review.comment);
    }

    // Save the update
    const handleSaveEdit = () => {
        updateReview(editingId, editRating, editComment);
        setEditingId(null);
    }

    return (
    <div className="sp-wrapper">
        {/* Back button */}
        <button className="sp-back" onClick={() => navigate(-1)}>
            <FaArrowLeft /> Back
        </button>

        {/* Product */}
        <div className="sp-container">
            {/* Image */}
            <div className="sp-img-wrapper">
                <img
                    src={`http://127.0.0.1:5000/static/uploads/${product.image_filename}`}
                    alt={product.name}
                    className="sp-img"
                />
                {!isAdmin && (
                    <button
                        className={`sp-wishlist-btn ${isInWishlist ? "wishlisted" : ""}`}
                        onClick={() => addToWishlist(product.id)}
                        title={isInWishlist ? "In your wishlist" : "Add to wishlist"}
                    >
                        <FaHeart />
                    </button>
                )}
            </div>

            {/* Details */}
            <div className="sp-details">
                <h1 className="sp-title">{product.name}</h1>
                <p className="sp-price">${product.price}.00</p>
                <p className="sp-description">{product.description}</p>

                <div className="sp-stock">
                    {product.availability > 0 ? (
                        <span className="sp-in-stock">● In Stock ({product.availability} left)</span>
                    ) : (
                        <span className="sp-out-stock">● Out of Stock</span>
                    )}
                </div>

                {!isAdmin && product.availability > 0 && (
                    <div className="sp-order-section">
                        <div className="sp-quantity">
                            <button className="sp-qty-btn" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>−</button>
                            <span className="sp-qty-value">{quantity}</span>
                            <button className="sp-qty-btn" onClick={() => setQuantity((q) => Math.min(product.availability, q + 1))}>+</button>
                        </div>
                        <button className="sp-order-btn" onClick={handleOrder} disabled={ordering}>
                            {ordering ? "Placing Order..." : "Place Order"}
                        </button>
                    </div>
                )}

                {orderMessage && (
                    <p className={`sp-order-msg ${orderMessage.startsWith("✓") ? "success" : "error"}`}>
                        {orderMessage}
                    </p>
                )}
            </div>
        </div> 

        {/* Reviews */}
        <div className="sp-reviews">
            <h2 className="sp-reviews-title">Reviews</h2>

            {authToken && current_user?.role?.toLowerCase() !== "admin" && (
                <div className="sp-review-form">
                    <h3>Write a Review</h3>
                    <div className="sp-stars">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                                key={star}
                                className={star <= rating ? "star active" : "star"}
                                onClick={() => setRating(star)}
                            />
                        ))}
                    </div>
                    <textarea
                        className="sp-review-input"
                        placeholder="Share your thoughts..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <button className="sp-review-btn" onClick={handleSubmitReview}>
                        Submit Review
                    </button>
                </div>
            )}

            {reviews.length === 0 ? (
                <p className="sp-no-reviews">No reviews yet. Be the first!</p>
            ) : (
                reviews.map((review) => (
                    <div key={review.id} className="sp-review-card">
                        {editingId === review.id ? (
                            <div className="sp-review-edit">
                                <div className="sp-stars">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <FaStar
                                            key={star}
                                            className={star <= editRating ? "star active" : "star"}
                                            onClick={() => setEditRating(star)}
                                        />
                                    ))}
                                </div>
                                <textarea
                                    className="sp-review-input"
                                    value={editComment}
                                    onChange={(e) => setEditComment(e.target.value)}
                                />
                                <div className="sp-review-actions">
                                    <button className="sp-review-btn" onClick={handleSaveEdit}>Save</button>
                                    <button className="sp-review-cancel" onClick={() => setEditingId(null)}>Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="sp-review-header">
                                    <span className="sp-review-author">{review.user_name}</span>
                                    <div className="sp-stars">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <FaStar
                                                key={star}
                                                className={star <= review.rating ? "star active" : "star"}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <p className="sp-review-comment">{review.comment}</p>
                                <span className="sp-review-date">
                                    {new Date(review.created_at).toLocaleDateString()}
                                </span>
                                {current_user?.id === review.user_id && (
                                    <div className="sp-review-actions">
                                        <button className="sp-review-edit-btn" onClick={() => handleEdit(review)}>Edit</button>
                                        <button className="sp-review-delete-btn" onClick={() => deleteReview(review.id)}>Delete</button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                ))
            )}
        </div>
    </div>
);
}